import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceOwnerIdProps {
    value: string;
}
export declare class WorkspaceOwnerId extends ValueObject<WorkspaceOwnerIdProps> {
    private constructor();
    get value(): string;
    static create(value: string): WorkspaceOwnerId;
}
