import { ValueObject } from '@rrss-auto/domain';

export interface WorkspaceLimitsProps {
  maxBusinesses: number;
  maxConcurrentExecutions: number;
  maxProxies: number;
  maxVms: number;
}

export class WorkspaceLimits extends ValueObject<WorkspaceLimitsProps> {
  private constructor(props: WorkspaceLimitsProps) {
    super(props);
  }

  get maxBusinesses(): number {
    return this.props.maxBusinesses;
  }

  get maxConcurrentExecutions(): number {
    return this.props.maxConcurrentExecutions;
  }

  get maxProxies(): number {
    return this.props.maxProxies;
  }

  get maxVms(): number {
    return this.props.maxVms;
  }

  public static create(props: WorkspaceLimitsProps): WorkspaceLimits {
    if (
      props.maxBusinesses < 0 ||
      props.maxConcurrentExecutions < 0 ||
      props.maxProxies < 0 ||
      props.maxVms < 0
    ) {
      throw new Error('Workspace limits cannot be negative');
    }

    return new WorkspaceLimits(props);
  }
}
