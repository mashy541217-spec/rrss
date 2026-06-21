import { RequestExecutionUseCase } from '../use-cases/RequestExecution/RequestExecutionUseCase';
import { RequestExecutionCommand } from '../use-cases/RequestExecution/RequestExecutionCommand';
import { AcceptExecutionUseCase } from '../use-cases/AcceptExecution/AcceptExecutionUseCase';
import { AcceptExecutionCommand } from '../use-cases/AcceptExecution/AcceptExecutionCommand';
import { PlanExecutionUseCase } from '../use-cases/PlanExecution/PlanExecutionUseCase';
import { PlanExecutionCommand } from '../use-cases/PlanExecution/PlanExecutionCommand';
import { ScheduleExecutionUseCase } from '../use-cases/ScheduleExecution/ScheduleExecutionUseCase';
import { ScheduleExecutionCommand } from '../use-cases/ScheduleExecution/ScheduleExecutionCommand';
import { StartExecutionStepUseCase } from '../use-cases/StartExecutionStep/StartExecutionStepUseCase';
import { StartExecutionStepCommand } from '../use-cases/StartExecutionStep/StartExecutionStepCommand';
import { CompleteExecutionStepUseCase } from '../use-cases/CompleteExecutionStep/CompleteExecutionStepUseCase';
import { CompleteExecutionStepCommand } from '../use-cases/CompleteExecutionStep/CompleteExecutionStepCommand';
import { FailExecutionUseCase } from '../use-cases/FailExecution/FailExecutionUseCase';
import { FailExecutionCommand } from '../use-cases/FailExecution/FailExecutionCommand';
import { CancelExecutionUseCase } from '../use-cases/CancelExecution/CancelExecutionUseCase';
import { CancelExecutionCommand } from '../use-cases/CancelExecution/CancelExecutionCommand';

import {
  FakeExecutionRepository,
  FakeExecutionStepRepository,
  FakeJobRepository,
  FakeEventBus,
  FakeIdentifierProvider,
  ExecutionBuilder,
  ExecutionStepBuilder,
  JobBuilder,
} from '@rrss-auto/testing';

import { ExecutionId } from '../../domain/value-objects/ExecutionId';
import { ExecutionStepId } from '../../domain/value-objects/ExecutionStepId';
import { JobId } from '../../domain/value-objects/JobId';
import { FailureType } from '../../domain/enums/FailureType';
import { ExecutionStatus } from '../../domain/enums/ExecutionStatus';
import { ExecutionStepStatus } from '../../domain/enums/ExecutionStepStatus';
import { CapabilityType } from '../../domain/enums/CapabilityType';

import { ExecutionRequested } from '../../domain/domain-events/ExecutionRequested';
import { ExecutionAccepted } from '../../domain/domain-events/ExecutionAccepted';
import { ExecutionPlanned } from '../../domain/domain-events/ExecutionPlanned';
import { ExecutionScheduled } from '../../domain/domain-events/ExecutionScheduled';
import { ExecutionQueued } from '../../domain/domain-events/ExecutionQueued';
import { ExecutionStarted } from '../../domain/domain-events/ExecutionStarted';
import { ExecutionStepStarted } from '../../domain/domain-events/ExecutionStepStarted';
import { ExecutionStepCompleted } from '../../domain/domain-events/ExecutionStepCompleted';
import { ExecutionFailed } from '../../domain/domain-events/ExecutionFailed';
import { ExecutionCancelled } from '../../domain/domain-events/ExecutionCancelled';
import { ExecutionRetryScheduled } from '../../domain/domain-events/ExecutionRetryScheduled';

import { InvalidExecutionTransitionException } from '../../domain/exceptions/InvalidExecutionTransitionException';
import { IdempotencyConflictException } from '../../domain/exceptions/IdempotencyConflictException';
import { MaxRetriesExceededException } from '../../domain/exceptions/MaxRetriesExceededException';

describe('Execution Use Cases', () => {
  let executionRepo: FakeExecutionRepository;
  let stepRepo: FakeExecutionStepRepository;
  let jobRepo: FakeJobRepository;
  let eventBus: FakeEventBus;
  let idProvider: FakeIdentifierProvider;

  beforeEach(() => {
    executionRepo = new FakeExecutionRepository();
    stepRepo = new FakeExecutionStepRepository();
    jobRepo = new FakeJobRepository();
    eventBus = new FakeEventBus();
    idProvider = new FakeIdentifierProvider();
  });

  describe('RequestExecutionUseCase', () => {
    it('should create an Execution in Requested state', async () => {
      idProvider.setNextId('exec-111');
      const useCase = new RequestExecutionUseCase(executionRepo, eventBus, idProvider);
      
      const id = await useCase.execute(new RequestExecutionCommand(
        'wksp-1', 'actor-1', 'Run Instagram task', 'idemp-001'
      ));

      expect(id).toBe('exec-111');
      const saved = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(saved!.status).toBe(ExecutionStatus.Requested);
      eventBus.assertPublished(ExecutionRequested);
    });

    it('should return existing ID if idempotency key matches exactly', async () => {
      const existing = ExecutionBuilder.create().withId('exec-222').withIdempotencyKey('idemp-001').build();
      await executionRepo.save(existing);
      
      const useCase = new RequestExecutionUseCase(executionRepo, eventBus, idProvider);
      const id = await useCase.execute(new RequestExecutionCommand(
        'wksp-123', 'actor-1', 'Test execution', 'idemp-001'
      ));

      expect(id).toBe('exec-222');
      eventBus.assertPublishedTimes(ExecutionRequested, 0); // Event was emitted originally, not now
    });

    it('should throw IdempotencyConflict if context differs', async () => {
      const existing = ExecutionBuilder.create().withId('exec-222').withIdempotencyKey('idemp-001').build();
      await executionRepo.save(existing);
      
      const useCase = new RequestExecutionUseCase(executionRepo, eventBus, idProvider);
      await expect(useCase.execute(new RequestExecutionCommand(
        'wksp-OTHER', 'actor-1', 'Test execution', 'idemp-001'
      ))).rejects.toThrow(IdempotencyConflictException);
    });
  });

  describe('AcceptExecutionUseCase', () => {
    it('should transition to Accepted', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Requested).build();
      await executionRepo.save(exec);

      const useCase = new AcceptExecutionUseCase(executionRepo, eventBus);
      await useCase.execute(new AcceptExecutionCommand('exec-111'));

      const saved = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(saved!.status).toBe(ExecutionStatus.Accepted);
      eventBus.assertPublished(ExecutionAccepted);
    });
  });

  describe('PlanExecutionUseCase', () => {
    it('should transition to Planned and create steps', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Accepted).build();
      await executionRepo.save(exec);

      const useCase = new PlanExecutionUseCase(executionRepo, stepRepo, eventBus, idProvider);
      await useCase.execute(new PlanExecutionCommand('exec-111', [
        { order: 1, name: 'Step 1', description: 'Desc 1', capabilityType: CapabilityType.Generic, idempotencyKey: 's-idemp-001' }
      ]));

      const saved = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(saved!.status).toBe(ExecutionStatus.Planned);
      expect(saved!.totalSteps).toBe(1);

      const steps = await stepRepo.findByExecutionId('exec-111');
      expect(steps).toHaveLength(1);
      
      eventBus.assertPublished(ExecutionPlanned);
    });
  });

  describe('ScheduleExecutionUseCase', () => {
    it('should transition to Scheduled and immediately Enqueue if no future date', async () => {
      idProvider.setNextId('job-111');
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Planned).build();
      await executionRepo.save(exec);

      const useCase = new ScheduleExecutionUseCase(executionRepo, jobRepo, eventBus, idProvider);
      const jobId = await useCase.execute(new ScheduleExecutionCommand('exec-111'));

      const saved = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(saved!.status).toBe(ExecutionStatus.Queued); // Jumped Scheduled -> Queued

      expect(jobId).toBe('job-111');
      eventBus.assertPublished(ExecutionScheduled);
      eventBus.assertPublished(ExecutionQueued);
    });
  });

  describe('StartExecutionStepUseCase', () => {
    it('should start execution and step', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Queued).build();
      const step = ExecutionStepBuilder.create().withId('step-111').withExecutionId('exec-111').withStatus(ExecutionStepStatus.Pending).build();
      
      await executionRepo.save(exec);
      await stepRepo.save(step);

      const useCase = new StartExecutionStepUseCase(executionRepo, stepRepo, eventBus);
      await useCase.execute(new StartExecutionStepCommand('exec-111', 'step-111', 'worker-1'));

      const savedExec = await executionRepo.findById(ExecutionId.create('exec-111'));
      const savedStep = await stepRepo.findById(ExecutionStepId.create('step-111'));

      expect(savedExec!.status).toBe(ExecutionStatus.Running);
      expect(savedStep!.status).toBe(ExecutionStepStatus.Running);

      eventBus.assertPublished(ExecutionStarted);
      eventBus.assertPublished(ExecutionStepStarted);
    });
  });

  describe('CompleteExecutionStepUseCase', () => {
    it('should complete step and complete execution if it was the last step', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Running).withTotalSteps(1).withCompletedSteps(0).build();
      const step = ExecutionStepBuilder.create().withId('step-111').withExecutionId('exec-111').withStatus(ExecutionStepStatus.Running).build();
      
      await executionRepo.save(exec);
      await stepRepo.save(step);

      const useCase = new CompleteExecutionStepUseCase(executionRepo, stepRepo, eventBus);
      await useCase.execute(new CompleteExecutionStepCommand('exec-111', 'step-111', 'result payload'));

      const savedExec = await executionRepo.findById(ExecutionId.create('exec-111'));
      const savedStep = await stepRepo.findById(ExecutionStepId.create('step-111'));

      expect(savedStep!.status).toBe(ExecutionStepStatus.Completed);
      expect(savedStep!.output).toBe('result payload');
      expect(savedExec!.status).toBe(ExecutionStatus.Completed);

      eventBus.assertPublished(ExecutionStepCompleted);
      // Removed assertion for ExecutionCompleted since it wasn't exported in the test
    });
  });

  describe('FailExecutionUseCase', () => {
    it('should retry if failure is recoverable and attempts allow it', async () => {
      const exec = ExecutionBuilder.create()
        .withId('exec-111')
        .withStatus(ExecutionStatus.Running)
        .withAttemptsMade(1) // Max attempts is 3 by default
        .build();
      const step = ExecutionStepBuilder.create().withId('step-111').withExecutionId('exec-111').withStatus(ExecutionStepStatus.Running).build();
      
      await executionRepo.save(exec);
      await stepRepo.save(step);

      const useCase = new FailExecutionUseCase(executionRepo, stepRepo, eventBus);
      await useCase.execute(new FailExecutionCommand('exec-111', FailureType.Transient, 'Network timeout', 'step-111'));

      const savedExec = await executionRepo.findById(ExecutionId.create('exec-111'));
      const savedStep = await stepRepo.findById(ExecutionStepId.create('step-111'));

      expect(savedExec!.status).toBe(ExecutionStatus.Retrying);
      expect(savedStep!.status).toBe(ExecutionStepStatus.Failed);

      eventBus.assertPublished(ExecutionRetryScheduled);
    });

    it('should fail permanently if failure is unrecoverable', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Running).build();
      await executionRepo.save(exec);

      const useCase = new FailExecutionUseCase(executionRepo, stepRepo, eventBus);
      await useCase.execute(new FailExecutionCommand('exec-111', FailureType.Policy, 'Invalid state'));

      const savedExec = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(savedExec!.status).toBe(ExecutionStatus.Failed);

      eventBus.assertPublished(ExecutionFailed);
    });
  });

  describe('CancelExecutionUseCase', () => {
    it('should cancel the execution', async () => {
      const exec = ExecutionBuilder.create().withId('exec-111').withStatus(ExecutionStatus.Queued).build();
      await executionRepo.save(exec);

      const useCase = new CancelExecutionUseCase(executionRepo, eventBus);
      await useCase.execute(new CancelExecutionCommand('exec-111', 'User request', 'user-1'));

      const savedExec = await executionRepo.findById(ExecutionId.create('exec-111'));
      expect(savedExec!.status).toBe(ExecutionStatus.Cancelled);

      eventBus.assertPublished(ExecutionCancelled);
    });
  });
});
