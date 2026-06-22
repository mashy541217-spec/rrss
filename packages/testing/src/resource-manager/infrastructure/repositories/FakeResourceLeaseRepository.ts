import { IResourceLeaseRepository, ResourceLease, LeaseId } from '../../../../../../apps/api/src/modules/resource-manager/domain';

export class FakeResourceLeaseRepository implements IResourceLeaseRepository {
  public leases = new Map<string, ResourceLease>();

  public async save(lease: ResourceLease): Promise<void> {
    this.leases.set(lease.id.value, lease);
  }

  public async findById(id: LeaseId): Promise<ResourceLease | null> {
    return this.leases.get(id.value) || null;
  }

  public async delete(id: LeaseId): Promise<void> {
    this.leases.delete(id.value);
  }
}
