import { ValueObject } from '@rrss-auto/domain';

interface DrainPolicyProps {
  allowNewAssignments: boolean;
  maxDrainTimeSeconds: number;
}

export class DrainPolicy extends ValueObject<DrainPolicyProps> {
  private constructor(props: DrainPolicyProps) {
    super(props);
  }

  get allowNewAssignments(): boolean { return this.props.allowNewAssignments; }
  get maxDrainTimeSeconds(): number { return this.props.maxDrainTimeSeconds; }

  public static create(allowNewAssignments: boolean, maxDrainTimeSeconds: number): DrainPolicy {
    return new DrainPolicy({ allowNewAssignments, maxDrainTimeSeconds });
  }
}
