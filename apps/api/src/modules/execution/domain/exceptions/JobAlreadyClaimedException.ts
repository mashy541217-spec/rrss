import { ExecutionException } from './ExecutionException';
export class JobAlreadyClaimedException extends ExecutionException {
  constructor(message: string) { super(message, 'JOB_ALREADY_CLAIMED'); this.name = 'JobAlreadyClaimedException'; }
}
