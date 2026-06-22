import { IEventBus } from '@rrss-auto/application';
import { IResourceLeaseRepository } from '../../../domain/repositories/IResourceLeaseRepository';
import { IResourcePoolRepository } from '../../../domain/repositories/IResourcePoolRepository';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { LeaseNotFoundException } from '../../../domain/exceptions/LeaseNotFoundException';

export interface ReleaseResourceCommand {
  leaseId: string;
  reason: string;
}

export class ReleaseResourceUseCase {
  constructor(
    private readonly leaseRepo: IResourceLeaseRepository,
    private readonly poolRepo: IResourcePoolRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReleaseResourceCommand): Promise<void> {
    const lease = await this.leaseRepo.findById(LeaseId.create(command.leaseId));
    if (!lease) throw new LeaseNotFoundException(`Lease not found: ${command.leaseId}`);

    lease.release(command.reason);
    await this.leaseRepo.save(lease);
    
    // We would normally look up the pool type by the resource, but for now we simply publish
    await this.eventBus.publishAll(lease.domainEvents);
    lease.clearDomainEvents();
  }
}
