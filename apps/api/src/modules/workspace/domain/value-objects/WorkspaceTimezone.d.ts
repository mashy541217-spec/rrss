import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceTimezoneProps {
    value: string;
}
export declare class WorkspaceTimezone extends ValueObject<WorkspaceTimezoneProps> {
    private constructor();
    get value(): string;
    static create(value: string): WorkspaceTimezone;
}
