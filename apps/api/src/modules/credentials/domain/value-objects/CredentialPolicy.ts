import { ValueObject } from '@rrss-auto/domain';
import { RotationPolicy } from '../enums/RotationPolicy';

interface CredentialPolicyProps {
  rotationPolicy: RotationPolicy;
  requiresMfa?: boolean;
  expiresAt?: Date;
}

export class CredentialPolicy extends ValueObject<CredentialPolicyProps> {
  public get rotationPolicy(): RotationPolicy {
    return this.props.rotationPolicy;
  }
  
  public get requiresMfa(): boolean {
    return this.props.requiresMfa || false;
  }

  public get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  public static create(props: CredentialPolicyProps): CredentialPolicy {
    return new CredentialPolicy({
      ...props,
      requiresMfa: props.requiresMfa ?? false
    });
  }
}
