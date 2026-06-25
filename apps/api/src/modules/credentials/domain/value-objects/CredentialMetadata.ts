import { ValueObject } from '@rrss-auto/domain';

interface CredentialMetadataProps {
  data: Record<string, any>;
}

export class CredentialMetadata extends ValueObject<CredentialMetadataProps> {
  public get data(): Record<string, any> {
    return { ...this.props.data };
  }

  public static create(data: Record<string, any> = {}): CredentialMetadata {
    return new CredentialMetadata({ data });
  }
}
