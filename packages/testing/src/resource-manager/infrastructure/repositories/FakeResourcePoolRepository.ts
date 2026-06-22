import { IResourcePoolRepository, ResourcePool, ResourceType } from '../../../../../../apps/api/src/modules/resource-manager/domain';

export class FakeResourcePoolRepository implements IResourcePoolRepository {
  public pools = new Map<string, ResourcePool>();

  public async save(pool: ResourcePool): Promise<void> {
    this.pools.set(pool.type.type, pool);
  }

  public async findByType(type: ResourceType): Promise<ResourcePool | null> {
    return this.pools.get(type.type) || null;
  }

  public async findAll(): Promise<ResourcePool[]> {
    return Array.from(this.pools.values());
  }
}
