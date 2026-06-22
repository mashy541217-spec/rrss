import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IResourcePoolRepository } from '../../../domain/repositories/IResourcePoolRepository';
import { IResourceLeaseRepository } from '../../../domain/repositories/IResourceLeaseRepository';
import { ResourceType } from '../../../domain/value-objects/ResourceType';
import { ResourceLease } from '../../../domain/aggregates/ResourceLease';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { ResourceId } from '../../../domain/value-objects/ResourceId';

export interface AllocateWorkerCommand {
  executionId: string;
  durationSeconds: number;
}

export class AllocateWorkerUseCase {
  constructor(
    private readonly poolRepo: IResourcePoolRepository,
    private readonly leaseRepo: IResourceLeaseRepository,
    private readonly eventBus: IEventBus,
    private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: AllocateWorkerCommand): Promise<string> {
    const pool = await this.poolRepo.findByType(ResourceType.Worker);
    if (!pool) throw new Error('Worker pool not initialized');

    // Attempt allocation
    pool.allocate(1);
    await this.poolRepo.save(pool);

    const rawId = this.idProvider.nextId();
    // Assuming a specific resource is assigned by infra, we assign a placeholder
    const resourceId = ResourceId.create(`worker-res-${rawId}`);
    
    const lease = ResourceLease.create(
      resourceId,
      command.executionId,
      command.durationSeconds,
      LeaseId.create(rawId)
    );

    await this.leaseRepo.save(lease);

    await this.eventBus.publishAll(pool.domainEvents);
    await this.eventBus.publishAll(lease.domainEvents);
    pool.clearDomainEvents();
    lease.clearDomainEvents();

    return rawId;
  }
}
