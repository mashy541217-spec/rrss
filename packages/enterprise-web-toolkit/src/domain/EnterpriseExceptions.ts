export class EnterpriseException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnterpriseException';
  }
}

export class AuthenticationFailedException extends EnterpriseException {
  constructor(message = 'Authentication to the enterprise system failed.') {
    super(message);
    this.name = 'AuthenticationFailedException';
  }
}

export class SessionExpiredException extends EnterpriseException {
  constructor() {
    super('Enterprise session has expired or is invalid.');
    this.name = 'SessionExpiredException';
  }
}

export class RecordNotFoundException extends EnterpriseException {
  constructor(recordId: string) {
    super(`Enterprise record [${recordId}] was not found.`);
    this.name = 'RecordNotFoundException';
  }
}
