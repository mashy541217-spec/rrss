import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceSlugProps {
    value: string;
}
export declare class WorkspaceSlug extends ValueObject<WorkspaceSlugProps> {
    private constructor();
    get value(): string;
    static create(value: string): WorkspaceSlug;
}
