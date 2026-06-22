import { ValueObject } from '@rrss-auto/domain';

export interface SchedulerIdProps {
  value: string;
}

export class SchedulerId extends ValueObject<SchedulerIdProps> {
  private constructor(props: SchedulerIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): SchedulerId {
    if (!value || value.trim().length === 0) {
      throw new Error('SchedulerId cannot be empty');
    }
    return new SchedulerId({ value: value.trim() });
  }
}
