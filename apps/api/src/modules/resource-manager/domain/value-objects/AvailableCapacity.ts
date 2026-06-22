import { ValueObject } from '@rrss-auto/domain';
import { Capacity } from './Capacity';

interface AvailableCapacityProps {
  available: number;
}

export class AvailableCapacity extends ValueObject<AvailableCapacityProps> {
  private constructor(props: AvailableCapacityProps) {
    super(props);
  }

  get available(): number {
    return this.props.available;
  }

  public static create(available: number, capacity: Capacity): AvailableCapacity {
    if (available < 0) throw new Error('AvailableCapacity cannot be negative');
    if (available > capacity.total) throw new Error('AvailableCapacity cannot exceed total Capacity');
    return new AvailableCapacity({ available });
  }

  public hasSufficient(amount: number): boolean {
    return this.available >= amount;
  }
}
