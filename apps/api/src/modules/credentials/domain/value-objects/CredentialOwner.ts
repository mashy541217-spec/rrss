import { ValueObject } from '@rrss-auto/domain';

interface CredentialOwnerProps {
  ownerId: string;
}

export class CredentialOwner extends ValueObject<CredentialOwnerProps> {
  public get ownerId(): string {
    return this.props.ownerId;
  }

  public static create(ownerId: string): CredentialOwner {
    if (!ownerId) {
      throw new Error('Owner ID is required');
    }
    return new CredentialOwner({ ownerId });
  }
}
