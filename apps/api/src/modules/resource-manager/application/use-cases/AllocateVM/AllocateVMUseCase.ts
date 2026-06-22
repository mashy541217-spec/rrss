import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IResourcePoolRepository } from '../../../domain/repositories/IResourcePoolRepository';
import { IResourceLeaseRepository } from '../../../domain/repositories/IResourceLeaseRepository';
import { ResourceType } from '../../../domain/value-objects/ResourceType';
import { ResourceLease } from '../../../domain/aggregates/ResourceLease';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { ResourceId } from '../../../domain/value-objects/ResourceId';

export interface AllocateVMCommand {
  executionId: string;
  durationSeconds: number;
}

export class AllocateVMUseCase {
  constructor(
    private readonly poolRepo: IResourcePoolRepository,
    private readonly leaseRepo: IResourceLeaseRepository,
    private readonly eventBus: IEventBus,
    private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: AllocateVMCommand): Promise<string> {
    const pool = await this.poolRepo.findByType(ResourceType.VM);
    if (!pool) throw new Error('VM pool not initialized');

    pool.allocate(1);
    await this.poolRepo.save(pool);

    const rawId = this.idProvider.nextId();
    const lease = ResourceLease.create(
      ResourceId.create(`vm-res-${rawId}`),
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
