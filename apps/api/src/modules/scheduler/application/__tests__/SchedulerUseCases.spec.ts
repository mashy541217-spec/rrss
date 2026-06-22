import { FakeEventBus, FakeIdentifierProvider } from '@rrss-auto/testing';
import { CreateScheduleUseCase } from '../use-cases/CreateSchedule/CreateScheduleUseCase';
import { ScheduleExecutionUseCase } from '../use-cases/ScheduleExecution/ScheduleExecutionUseCase';
import { CancelScheduleUseCase } from '../use-cases/CancelSchedule/CancelScheduleUseCase';
import { ReserveWorkerUseCase } from '../use-cases/ReserveWorker/ReserveWorkerUseCase';
import { ReleaseReservationUseCase } from '../use-cases/ReleaseReservation/ReleaseReservationUseCase';
import { RescheduleExecutionUseCase } from '../use-cases/RescheduleExecution/RescheduleExecutionUseCase';
import { DispatchExecutionUseCase } from '../use-cases/DispatchExecution/DispatchExecutionUseCase';

import { FakeScheduleRepository } from '../../../../../../../packages/testing/src/scheduler/infrastructure/repositories/FakeScheduleRepository';
import { FakeSchedulerRepository } from '../../../../../../../packages/testing/src/scheduler/infrastructure/repositories/FakeSchedulerRepository';
import { FakeExecutionReservationRepository } from '../../../../../../../packages/testing/src/scheduler/infrastructure/repositories/FakeExecutionReservationRepository';
import { ScheduleBuilder } from '../../../../../../../packages/testing/src/scheduler/domain/builders/ScheduleBuilder';
import { SchedulerBuilder } from '../../../../../../../packages/testing/src/scheduler/domain/builders/SchedulerBuilder';
import { ExecutionReservationBuilder } from '../../../../../../../packages/testing/src/scheduler/domain/builders/ExecutionReservationBuilder';
import { SchedulingPolicy } from '../../domain/value-objects/SchedulingPolicy';
import { SchedulingConstraints } from '../../domain/value-objects/SchedulingConstraints';
import { PriorityPolicy } from '../../domain/value-objects/PriorityPolicy';
import { DispatchPriority } from '../../domain/value-objects/DispatchPriority';
import { ScheduleStatus } from '../../domain/enums/ScheduleStatus';
import { SchedulerId } from '../../domain/value-objects/SchedulerId';
import { ScheduleId } from '../../domain/value-objects/ScheduleId';

import { ExecutionScheduled } from '../../domain/domain-events/ExecutionScheduled';
import { ExecutionDeferred } from '../../domain/domain-events/ExecutionDeferred';
import { ExecutionReserved } from '../../domain/domain-events/ExecutionReserved';
import { WorkerAssigned } from '../../domain/domain-events/WorkerAssigned';
import { SchedulingFailed } from '../../domain/domain-events/SchedulingFailed';

describe('Scheduler Use Cases', () => {
  let eventBus: FakeEventBus;
  let identifierProvider: FakeIdentifierProvider;
  let scheduleRepo: FakeScheduleRepository;
  let schedulerRepo: FakeSchedulerRepository;
  let reservationRepo: FakeExecutionReservationRepository;

  beforeEach(() => {
    eventBus = new FakeEventBus();
    identifierProvider = new FakeIdentifierProvider();
    scheduleRepo = new FakeScheduleRepository();
    schedulerRepo = new FakeSchedulerRepository();
    reservationRepo = new FakeExecutionReservationRepository();
  });

  describe('CreateScheduleUseCase', () => {
    it('should create a schedule successfully', async () => {
      const useCase = new CreateScheduleUseCase(scheduleRepo, eventBus, identifierProvider);
      
      const id = await useCase.execute({
        workspaceRef: 'wksp-1',
        schedulingPolicy: SchedulingPolicy.createImmediate(),
      });

      const saved = await scheduleRepo.findById(ScheduleId.create(id));
      expect(saved).not.toBeNull();
      expect(saved!.workspaceRef).toBe('wksp-1');
      expect(saved!.status).toBe(ScheduleStatus.Active);
    });
  });

  describe('ScheduleExecutionUseCase', () => {
    it('should dispatch an execution when scheduler allows it', async () => {
      const scheduler = SchedulerBuilder.create().withId('sch-1').build();
      await schedulerRepo.save(scheduler);

      const schedule = ScheduleBuilder.create().withId('sched-1').build();
      await scheduleRepo.save(schedule);

      const useCase = new ScheduleExecutionUseCase(schedulerRepo, scheduleRepo, eventBus);
      
      await useCase.execute({
        schedulerId: 'sch-1',
        scheduleId: 'sched-1',
        executionId: 'exec-1',
        currentActiveCount: 10,
      });

      eventBus.assertPublished(ExecutionScheduled);
    });

    it('should defer execution when concurrency limit is reached', async () => {
      const scheduler = SchedulerBuilder.create().withId('sch-1').withConcurrencyLimit(5).build();
      await schedulerRepo.save(scheduler);

      const schedule = ScheduleBuilder.create().withId('sched-1').build();
      await scheduleRepo.save(schedule);

      const useCase = new ScheduleExecutionUseCase(schedulerRepo, scheduleRepo, eventBus);
      
      await useCase.execute({
        schedulerId: 'sch-1',
        scheduleId: 'sched-1',
        executionId: 'exec-1',
        currentActiveCount: 10, // Exceeds limit 5
      });

      eventBus.assertPublished(ExecutionDeferred);
    });
  });

  describe('CancelScheduleUseCase', () => {
    it('should cancel an active schedule', async () => {
      const schedule = ScheduleBuilder.create().withId('sched-1').build();
      await scheduleRepo.save(schedule);

      const useCase = new CancelScheduleUseCase(scheduleRepo, eventBus);
      await useCase.execute({ scheduleId: 'sched-1', reason: 'User requested' });

      const saved = await scheduleRepo.findById(ScheduleId.create('sched-1'));
      expect(saved!.status).toBe(ScheduleStatus.Cancelled);
    });
  });

  describe('ReserveWorkerUseCase', () => {
    it('should reserve a worker and emit events', async () => {
      const useCase = new ReserveWorkerUseCase(reservationRepo, eventBus, identifierProvider);
      
      const id = await useCase.execute({
        executionId: 'exec-1',
        workerId: 'worker-1',
        durationSeconds: 300,
      });

      const saved = await reservationRepo.findById({ value: id } as any);
      expect(saved).not.toBeNull();
      expect(saved!.workerId).toBe('worker-1');
      eventBus.assertPublished(ExecutionReserved);
      eventBus.assertPublished(WorkerAssigned);
    });
  });

  describe('ReleaseReservationUseCase', () => {
    it('should release an active reservation', async () => {
      const reservation = ExecutionReservationBuilder.create().withId('res-1').withStatus('active').build();
      await reservationRepo.save(reservation);

      const useCase = new ReleaseReservationUseCase(reservationRepo, eventBus);
      await useCase.execute({ reservationId: 'res-1', reason: 'Completed' });

      const saved = await reservationRepo.findById({ value: 'res-1' } as any);
      expect(saved!.status).toBe('released');
    });
  });

  describe('RescheduleExecutionUseCase', () => {
    it('should reschedule an execution and emit event', async () => {
      const schedule = ScheduleBuilder.create().withId('sched-1').build();
      await scheduleRepo.save(schedule);

      const useCase = new RescheduleExecutionUseCase(scheduleRepo, eventBus);
      await useCase.execute({
        scheduleId: 'sched-1',
        executionId: 'exec-1',
        newScheduledFor: new Date(),
        reason: 'Delayed manually',
      });

      eventBus.assertPublished(ExecutionScheduled);
    });
  });

  describe('DispatchExecutionUseCase', () => {
    it('should accept dispatch and assign worker', async () => {
      const scheduler = SchedulerBuilder.create().withId('sch-1').build();
      await schedulerRepo.save(scheduler);

      const useCase = new DispatchExecutionUseCase(schedulerRepo, eventBus);
      await useCase.execute({
        schedulerId: 'sch-1',
        executionId: 'exec-1',
        workerId: 'worker-1',
        reservationId: 'res-1',
      });

      eventBus.assertPublished(WorkerAssigned);
    });
  });
});
