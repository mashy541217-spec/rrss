import { ValueObject } from '@rrss-auto/domain';

export interface DispatchDelayProps {
  delayMs: number;
}

export class DispatchDelay extends ValueObject<DispatchDelayProps> {
  public static readonly IMMEDIATE = new DispatchDelay({ delayMs: 0 });

  private constructor(props: DispatchDelayProps) {
    super(props);
  }

  get delayMs(): number {
    return this.props.delayMs;
  }

  public static create(delayMs: number): DispatchDelay {
    if (delayMs < 0) {
      throw new Error('Delay cannot be negative');
    }
    return new DispatchDelay({ delayMs });
  }
}
