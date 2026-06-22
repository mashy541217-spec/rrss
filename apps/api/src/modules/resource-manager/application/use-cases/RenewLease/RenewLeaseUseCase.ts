import { IEventBus } from '@rrss-auto/application';
import { IResourceLeaseRepository } from '../../../domain/repositories/IResourceLeaseRepository';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { LeaseNotFoundException } from '../../../domain/exceptions/LeaseNotFoundException';

export interface RenewLeaseCommand {
  leaseId: string;
  extraSeconds: number;
}

export class RenewLeaseUseCase {
  constructor(
    private readonly leaseRepo: IResourceLeaseRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RenewLeaseCommand): Promise<void> {
    const lease = await this.leaseRepo.findById(LeaseId.create(command.leaseId));
    if (!lease) throw new LeaseNotFoundException(`Lease not found: ${command.leaseId}`);

    lease.renew(command.extraSeconds);
    await this.leaseRepo.save(lease);
    
    await this.eventBus.publishAll(lease.domainEvents);
    lease.clearDomainEvents();
  }
}
