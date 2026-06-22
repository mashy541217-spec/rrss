import { ResourceManagerException } from './ResourceManagerException';

export class InsufficientCapacityException extends ResourceManagerException {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_CAPACITY');
  }
}
