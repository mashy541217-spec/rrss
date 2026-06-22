import { ResourcePool, ResourceType, Capacity } from '../../../../../../apps/api/src/modules/resource-manager/domain';

export class ResourcePoolBuilder {
  private type: ResourceType = ResourceType.Worker;
  private totalCapacity: Capacity = Capacity.create(100);
  private usedCapacity: number = 0;

  public static create(): ResourcePoolBuilder {
    return new ResourcePoolBuilder();
  }

  public withType(type: ResourceType): ResourcePoolBuilder {
    this.type = type;
    return this;
  }

  public withTotalCapacity(total: number): ResourcePoolBuilder {
    this.totalCapacity = Capacity.create(total);
    return this;
  }

  public withUsedCapacity(used: number): ResourcePoolBuilder {
    this.usedCapacity = used;
    return this;
  }

  public build(): ResourcePool {
    const pool = ResourcePool.create(this.type, this.totalCapacity);
    if (this.usedCapacity > 0) {
      pool.allocate(this.usedCapacity);
    }
    return pool;
  }
}
