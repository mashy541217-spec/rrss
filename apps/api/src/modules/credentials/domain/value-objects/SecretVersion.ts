import { ValueObject } from '@rrss-auto/domain';

interface SecretVersionProps {
  value: number;
}

export class SecretVersion extends ValueObject<SecretVersionProps> {
  public get value(): number {
    return this.props.value;
  }

  public static create(version: number): SecretVersion {
    if (version < 1) {
      throw new Error('Secret version must be at least 1');
    }
    return new SecretVersion({ value: version });
  }

  public increment(): SecretVersion {
    return new SecretVersion({ value: this.props.value + 1 });
  }
}
