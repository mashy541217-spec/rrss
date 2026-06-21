import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceIdProps {
    value: string;
}
export declare class WorkspaceId extends ValueObject<WorkspaceIdProps> {
    private constructor();
    get value(): string;
    static create(value: string): WorkspaceId;
}
