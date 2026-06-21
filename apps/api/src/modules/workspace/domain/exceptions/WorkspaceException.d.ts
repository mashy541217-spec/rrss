import { DomainException } from '@rrss-auto/domain';
export declare abstract class WorkspaceException extends DomainException {
    protected constructor(message: string, code: string);
}
