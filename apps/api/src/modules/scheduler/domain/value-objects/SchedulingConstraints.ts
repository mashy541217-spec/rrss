import { ValueObject } from '@rrss-auto/domain';

export interface SchedulingConstraintsProps {
  requiredTags: string[];
  preventOverlap: boolean;
  requiredCapabilities?: string[];
}

export class SchedulingConstraints extends ValueObject<SchedulingConstraintsProps> {
  private constructor(props: SchedulingConstraintsProps) {
    super(props);
  }

  get requiredTags(): ReadonlyArray<string> { return this.props.requiredTags; }
  get preventOverlap(): boolean { return this.props.preventOverlap; }
  get requiredCapabilities(): ReadonlyArray<string> | undefined { return this.props.requiredCapabilities; }

  public static create(props: Partial<SchedulingConstraintsProps>): SchedulingConstraints {
    return new SchedulingConstraints({
      requiredTags: props.requiredTags ?? [],
      preventOverlap: props.preventOverlap ?? false,
      requiredCapabilities: props.requiredCapabilities,
    });
  }
}
