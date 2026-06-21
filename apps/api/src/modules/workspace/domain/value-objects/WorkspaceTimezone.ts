import { ValueObject } from '@rrss-auto/domain';
import { InvalidTimezoneException } from '../exceptions/InvalidTimezoneException';

export interface WorkspaceTimezoneProps {
  value: string;
}

export class WorkspaceTimezone extends ValueObject<WorkspaceTimezoneProps> {
  private constructor(props: WorkspaceTimezoneProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceTimezone {
    if (!value || value.trim().length === 0) {
      throw new InvalidTimezoneException('Timezone cannot be empty');
    }
    
    const trimmedValue = value.trim();

    try {
      Intl.DateTimeFormat(undefined, { timeZone: trimmedValue });
    } catch (e) {
      throw new InvalidTimezoneException(`Timezone '${trimmedValue}' is not a valid IANA timezone`);
    }

    return new WorkspaceTimezone({ value: trimmedValue });
  }
}
