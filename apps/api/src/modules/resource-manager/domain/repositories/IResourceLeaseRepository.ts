import { ResourceLease } from '../aggregates/ResourceLease';
import { LeaseId } from '../value-objects/LeaseId';

export interface IResourceLeaseRepository {
  save(lease: ResourceLease): Promise<void>;
  findById(id: LeaseId): Promise<ResourceLease | null>;
  delete(id: LeaseId): Promise<void>;
}
