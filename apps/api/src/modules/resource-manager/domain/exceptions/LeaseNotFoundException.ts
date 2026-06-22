import { ResourceManagerException } from './ResourceManagerException';

export class LeaseNotFoundException extends ResourceManagerException {
  constructor(message: string) {
    super(message, 'LEASE_NOT_FOUND');
  }
}
