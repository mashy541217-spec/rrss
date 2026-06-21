import { ValueObject } from '@rrss-auto/domain';
import { WorkspaceTimezone } from './WorkspaceTimezone';

export interface WorkspaceSettingsProps {
  timezone: WorkspaceTimezone;
  locale: string;
}

export class WorkspaceSettings extends ValueObject<WorkspaceSettingsProps> {
  private constructor(props: WorkspaceSettingsProps) {
    super(props);
  }

  get timezone(): WorkspaceTimezone {
    return this.props.timezone;
  }

  get locale(): string {
    return this.props.locale;
  }

  public static create(timezone: WorkspaceTimezone, locale: string): WorkspaceSettings {
    if (!locale || locale.trim().length === 0) {
       throw new Error('Locale cannot be empty');
    }

    return new WorkspaceSettings({
      timezone,
      locale: locale.trim()
    });
  }

  public updateTimezone(newTimezone: WorkspaceTimezone): WorkspaceSettings {
    return new WorkspaceSettings({
      ...this.props,
      timezone: newTimezone
    });
  }

  public updateLocale(newLocale: string): WorkspaceSettings {
    if (!newLocale || newLocale.trim().length === 0) {
      throw new Error('Locale cannot be empty');
    }
    
    return new WorkspaceSettings({
      ...this.props,
      locale: newLocale.trim()
    });
  }
}
