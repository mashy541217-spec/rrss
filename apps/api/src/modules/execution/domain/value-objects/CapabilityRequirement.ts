import { ValueObject } from '@rrss-auto/domain';
import { CapabilityType } from '../enums/CapabilityType';

/**
 * CapabilityRequirement – a capability an Execution needs to run.
 * Constraint map allows extensible key-value requirements (e.g. minCores, region).
 */
export interface CapabilityRequirementProps {
  type: CapabilityType;
  constraints: Readonly<Record<string, string>>;
}

export class CapabilityRequirement extends ValueObject<CapabilityRequirementProps> {
  private constructor(props: CapabilityRequirementProps) { super(props); }

  get type(): CapabilityType { return this.props.type; }
  get constraints(): Readonly<Record<string, string>> { return this.props.constraints; }

  public static create(type: CapabilityType, constraints: Record<string, string> = {}): CapabilityRequirement {
    return new CapabilityRequirement({ type, constraints });
  }

  public getConstraint(key: string): string | undefined {
    return this.props.constraints[key];
  }
}
