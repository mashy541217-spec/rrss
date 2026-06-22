import { ValueObject } from '@rrss-auto/domain';

export interface ConcurrencyLimitProps {
  maxConcurrent: number;
  maxPerWorkspace?: number;
}

export class ConcurrencyLimit extends ValueObject<ConcurrencyLimitProps> {
  private constructor(props: ConcurrencyLimitProps) {
    super(props);
  }

  get maxConcurrent(): number { return this.props.maxConcurrent; }
  get maxPerWorkspace(): number | undefined { return this.props.maxPerWorkspace; }

  public static create(maxConcurrent: number, maxPerWorkspace?: number): ConcurrencyLimit {
    if (maxConcurrent < 1) throw new Error('Max concurrent must be at least 1');
    if (maxPerWorkspace !== undefined && maxPerWorkspace < 1) {
      throw new Error('Max per workspace must be at least 1');
    }
    return new ConcurrencyLimit({ maxConcurrent, maxPerWorkspace });
  }
}
