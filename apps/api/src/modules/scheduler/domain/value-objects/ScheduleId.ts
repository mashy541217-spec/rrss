import { ValueObject } from '@rrss-auto/domain';

export interface ScheduleIdProps {
  value: string;
}

export class ScheduleId extends ValueObject<ScheduleIdProps> {
  private constructor(props: ScheduleIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): ScheduleId {
    if (!value || value.trim().length === 0) {
      throw new Error('ScheduleId cannot be empty');
    }
    return new ScheduleId({ value: value.trim() });
  }
}
