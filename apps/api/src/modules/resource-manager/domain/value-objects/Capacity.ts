import { ValueObject } from '@rrss-auto/domain';

interface CapacityProps {
  total: number;
}

export class Capacity extends ValueObject<CapacityProps> {
  private constructor(props: CapacityProps) {
    super(props);
  }

  get total(): number {
    return this.props.total;
  }

  public static create(total: number): Capacity {
    if (total < 0) throw new Error('Capacity cannot be negative');
    return new Capacity({ total });
  }

  public increase(amount: number): Capacity {
    return Capacity.create(this.total + amount);
  }

  public decrease(amount: number): Capacity {
    return Capacity.create(Math.max(0, this.total - amount));
  }
}
