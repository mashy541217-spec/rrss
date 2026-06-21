import { ValueObject } from '@rrss-auto/domain';
import { CapabilityType } from '../enums/CapabilityType';

/**
 * WorkerCapability – a capability a Worker declares when registering.
 */
export interface WorkerCapabilityProps {
  type: CapabilityType;
  version: string;
}

export class WorkerCapability extends ValueObject<WorkerCapabilityProps> {
  private constructor(props: WorkerCapabilityProps) { super(props); }

  get type(): CapabilityType { return this.props.type; }
  get version(): string { return this.props.version; }

  public static create(type: CapabilityType, version: string = '1.0.0'): WorkerCapability {
    return new WorkerCapability({ type, version });
  }

  public satisfies(requirement: { type: CapabilityType }): boolean {
    return this.props.type === requirement.type;
  }
}
