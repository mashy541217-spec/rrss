import { ValueObject } from '@rrss-auto/domain';
import { ConcurrencyLimit } from './ConcurrencyLimit';

export interface ConcurrencyPolicyProps {
  limit: ConcurrencyLimit;
  queueIfFull: boolean;
  maxQueueWaitMs?: number;
}

export class ConcurrencyPolicy extends ValueObject<ConcurrencyPolicyProps> {
  private constructor(props: ConcurrencyPolicyProps) {
    super(props);
  }

  get limit(): ConcurrencyLimit { return this.props.limit; }
  get queueIfFull(): boolean { return this.props.queueIfFull; }
  get maxQueueWaitMs(): number | undefined { return this.props.maxQueueWaitMs; }

  public static create(limit: ConcurrencyLimit, queueIfFull: boolean = true, maxQueueWaitMs?: number): ConcurrencyPolicy {
    if (maxQueueWaitMs !== undefined && maxQueueWaitMs < 0) {
      throw new Error('Max queue wait cannot be negative');
    }
    return new ConcurrencyPolicy({ limit, queueIfFull, maxQueueWaitMs });
  }
}
