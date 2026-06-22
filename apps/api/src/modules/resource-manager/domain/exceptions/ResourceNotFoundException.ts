import { ResourceManagerException } from './ResourceManagerException';

export class ResourceNotFoundException extends ResourceManagerException {
  constructor(message: string) {
    super(message, 'RESOURCE_NOT_FOUND');
  }
}
