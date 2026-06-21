import { ValueObject } from '@rrss-auto/domain';

export interface JobIdProps { value: string; }

export class JobId extends ValueObject<JobIdProps> {
  private constructor(props: JobIdProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): JobId {
    if (!value || value.trim().length === 0) {
      throw new Error('JobId cannot be empty');
    }
    return new JobId({ value: value.trim() });
  }
}
