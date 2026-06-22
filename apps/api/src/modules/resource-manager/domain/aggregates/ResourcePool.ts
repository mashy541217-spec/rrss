import { AggregateRoot, ValueObject } from '@rrss-auto/domain';
import { ResourceType } from '../value-objects/ResourceType';
import { Capacity } from '../value-objects/Capacity';
import { AvailableCapacity } from '../value-objects/AvailableCapacity';
import { CapacityExceeded } from '../domain-events/CapacityExceeded';

export interface ResourcePoolProps {
  type: ResourceType;
  totalCapacity: Capacity;
  usedCapacity: number;
}

export class ResourcePool extends AggregateRoot<ResourcePoolProps, ValueObject<any>> {
  private constructor(props: ResourcePoolProps, id: ValueObject<any>) {
    super(props, id);
  }

  get type(): ResourceType { return this.props.type; }
  get totalCapacity(): Capacity { return this.props.totalCapacity; }
  get usedCapacity(): number { return this.props.usedCapacity; }
  get availableCapacity(): AvailableCapacity {
    return AvailableCapacity.create(this.props.totalCapacity.total - this.props.usedCapacity, this.props.totalCapacity);
  }

  public static create(type: ResourceType, totalCapacity: Capacity): ResourcePool {
    // We use the ResourceType as the identity for the pool, since there is one pool per type
    return new ResourcePool({
      type,
      totalCapacity,
      usedCapacity: 0,
    }, type);
  }

  public allocate(amount: number = 1): void {
    if (!this.availableCapacity.hasSufficient(amount)) {
      this.addDomainEvent(new CapacityExceeded(this.type, amount, this.availableCapacity.available));
      throw new Error(`Insufficient capacity in pool ${this.type.type}`);
    }
    this.props.usedCapacity += amount;
  }

  public release(amount: number = 1): void {
    this.props.usedCapacity = Math.max(0, this.props.usedCapacity - amount);
  }

  public adjustTotalCapacity(newTotal: number): void {
    this.props.totalCapacity = Capacity.create(newTotal);
    if (this.props.usedCapacity > newTotal) {
      this.addDomainEvent(new CapacityExceeded(this.type, this.props.usedCapacity, 0));
    }
  }
}
