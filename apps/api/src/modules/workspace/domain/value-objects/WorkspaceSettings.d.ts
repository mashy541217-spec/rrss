import { ValueObject } from '@rrss-auto/domain';
import { WorkspaceTimezone } from './WorkspaceTimezone';
export interface WorkspaceSettingsProps {
    timezone: WorkspaceTimezone;
    locale: string;
}
export declare class WorkspaceSettings extends ValueObject<WorkspaceSettingsProps> {
    private constructor();
    get timezone(): WorkspaceTimezone;
    get locale(): string;
    static create(timezone: WorkspaceTimezone, locale: string): WorkspaceSettings;
    updateTimezone(newTimezone: WorkspaceTimezone): WorkspaceSettings;
    updateLocale(newLocale: string): WorkspaceSettings;
}
