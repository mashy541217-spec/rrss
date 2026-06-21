import { ValueObject } from '@rrss-auto/domain';
export interface WorkspaceLimitsProps {
    maxBusinesses: number;
    maxConcurrentExecutions: number;
    maxProxies: number;
    maxVms: number;
}
export declare class WorkspaceLimits extends ValueObject<WorkspaceLimitsProps> {
    private constructor();
    get maxBusinesses(): number;
    get maxConcurrentExecutions(): number;
    get maxProxies(): number;
    get maxVms(): number;
    static create(props: WorkspaceLimitsProps): WorkspaceLimits;
}
