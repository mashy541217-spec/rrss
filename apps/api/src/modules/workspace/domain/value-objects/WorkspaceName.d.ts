import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceNameProps {
    value: string;
}
export declare class WorkspaceName extends ValueObject<WorkspaceNameProps> {
    private constructor();
    get value(): string;
    static create(value: string): WorkspaceName;
}
