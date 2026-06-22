import { FakeEventBus, FakeIdentifierProvider } from '@rrss-auto/testing';
import { FakeWorkerRepository } from '../../../../../../../packages/testing/src/worker/infrastructure/repositories/FakeWorkerRepository';
import { WorkerBuilder } from '../../../../../../../packages/testing/src/worker/domain/builders/WorkerBuilder';

import { RegisterWorkerUseCase } from '../use-cases/RegisterWorker/RegisterWorkerUseCase';
import { HeartbeatWorkerUseCase } from '../use-cases/HeartbeatWorker/HeartbeatWorkerUseCase';
import { AssignExecutionUseCase } from '../use-cases/AssignExecution/AssignExecutionUseCase';
import { CompleteExecutionUseCase } from '../use-cases/CompleteExecution/CompleteExecutionUseCase';
import { PauseWorkerUseCase } from '../use-cases/PauseWorker/PauseWorkerUseCase';
import { ResumeWorkerUseCase } from '../use-cases/ResumeWorker/ResumeWorkerUseCase';
import { DrainWorkerUseCase } from '../use-cases/DrainWorker/DrainWorkerUseCase';
import { ShutdownWorkerUseCase } from '../use-cases/ShutdownWorker/ShutdownWorkerUseCase';

import { WorkerId } from '../../domain/value-objects/WorkerId';
import { WorkerStatus } from '../../domain/enums/WorkerStatus';
import { WorkerHealth } from '../../domain/enums/WorkerHealth';
import { WorkerType } from '../../domain/enums/WorkerType';

import { WorkerRegistered } from '../../domain/domain-events/WorkerRegistered';
import { WorkerStarted } from '../../domain/domain-events/WorkerStarted';
import { WorkerHeartbeatReceived } from '../../domain/domain-events/WorkerHeartbeatReceived';
import { ExecutionAssignedToWorker } from '../../domain/domain-events/ExecutionAssignedToWorker';
import { ExecutionCompletedByWorker } from '../../domain/domain-events/ExecutionCompletedByWorker';
import { WorkerPaused } from '../../domain/domain-events/WorkerPaused';
import { WorkerResumed } from '../../domain/domain-events/WorkerResumed';

describe('Worker Use Cases', () => {
  let eventBus: FakeEventBus;
  let identifierProvider: FakeIdentifierProvider;
  let workerRepo: FakeWorkerRepository;

  beforeEach(() => {
    eventBus = new FakeEventBus();
    identifierProvider = new FakeIdentifierProvider();
    workerRepo = new FakeWorkerRepository();
  });

  describe('RegisterWorkerUseCase', () => {
    it('should register a new worker and start session', async () => {
      const useCase = new RegisterWorkerUseCase(workerRepo, eventBus, identifierProvider);
      
      const id = await useCase.execute({
        workerType: 'vm',
        endpointUrl: 'http://10.0.0.1',
        maxExecutions: 4
      });

      const saved = await workerRepo.findById(WorkerId.create(id));
      expect(saved).not.toBeNull();
      expect(saved!.type).toBe(WorkerType.VM);
      expect(saved!.status).toBe(WorkerStatus.Idle); // because session is started

      eventBus.assertPublished(WorkerRegistered);
      eventBus.assertPublished(WorkerStarted);
    });
  });

  describe('HeartbeatWorkerUseCase', () => {
    it('should record heartbeat and emit event', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').build();
      await workerRepo.save(worker);

      const useCase = new HeartbeatWorkerUseCase(workerRepo, eventBus);
      await useCase.execute({
        workerId: 'worker-1',
        healthStatus: 'healthy',
        currentLoad: 0.5,
        uptimeSeconds: 120
      });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.health).toBe(WorkerHealth.Healthy);
      
      eventBus.assertPublished(WorkerHeartbeatReceived);
    });
  });

  describe('AssignExecutionUseCase', () => {
    it('should assign execution to worker and set status to busy', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').withCapacity(2).build();
      worker.startSession('session-1'); // set to idle
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new AssignExecutionUseCase(workerRepo, eventBus);
      await useCase.execute({
        workerId: 'worker-1',
        executionId: 'exec-1'
      });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Busy);
      expect(saved!.assignments.length).toBe(1);

      eventBus.assertPublished(ExecutionAssignedToWorker);
    });
  });

  describe('CompleteExecutionUseCase', () => {
    it('should mark execution as completed and free slot', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').withCapacity(2).build();
      worker.startSession('session-1');
      worker.assignExecution('exec-1');
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new CompleteExecutionUseCase(workerRepo, eventBus);
      await useCase.execute({
        workerId: 'worker-1',
        executionId: 'exec-1',
        durationMs: 5000
      });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Idle); // Back to idle because no other executions
      expect(saved!.assignments[0].status).toBe('completed');

      eventBus.assertPublished(ExecutionCompletedByWorker);
    });
  });

  describe('PauseWorkerUseCase', () => {
    it('should pause worker', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').build();
      worker.startSession('session-1');
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new PauseWorkerUseCase(workerRepo, eventBus);
      await useCase.execute({ workerId: 'worker-1', reason: 'manual' });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Paused);
      
      eventBus.assertPublished(WorkerPaused);
    });
  });

  describe('ResumeWorkerUseCase', () => {
    it('should resume paused worker', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').build();
      worker.startSession('session-1');
      worker.pause('manual');
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new ResumeWorkerUseCase(workerRepo, eventBus);
      await useCase.execute({ workerId: 'worker-1' });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Idle);
      
      eventBus.assertPublished(WorkerResumed);
    });
  });

  describe('DrainWorkerUseCase', () => {
    it('should pause worker for draining', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').build();
      worker.startSession('session-1');
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new DrainWorkerUseCase(workerRepo, eventBus);
      await useCase.execute({ workerId: 'worker-1' });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Paused); // Drain calls pause
      
      eventBus.assertPublished(WorkerPaused);
    });
  });

  describe('ShutdownWorkerUseCase', () => {
    it('should pause worker with shutdown reason', async () => {
      const worker = WorkerBuilder.create().withId('worker-1').build();
      worker.startSession('session-1');
      worker.clearDomainEvents();
      await workerRepo.save(worker);

      const useCase = new ShutdownWorkerUseCase(workerRepo, eventBus);
      await useCase.execute({ workerId: 'worker-1', reason: 'node dead' });

      const saved = await workerRepo.findById(WorkerId.create('worker-1'));
      expect(saved!.status).toBe(WorkerStatus.Terminated);
    });
  });
});
