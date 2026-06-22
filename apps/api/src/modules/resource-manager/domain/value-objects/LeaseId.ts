import { ValueObject } from '@rrss-auto/domain';

interface LeaseIdProps {
  value: string;
}

export class LeaseId extends ValueObject<LeaseIdProps> {
  private constructor(props: LeaseIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(id: string): LeaseId {
    if (!id || id.trim().length === 0) {
      throw new Error('LeaseId cannot be empty');
    }
    return new LeaseId({ value: id });
  }
}
