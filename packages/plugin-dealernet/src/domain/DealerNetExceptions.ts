import { EnterpriseException } from '@rrss-auto/enterprise-web-toolkit';

export class DealerNetException extends EnterpriseException {
  constructor(message: string) {
    super(message);
    this.name = 'DealerNetException';
  }
}

export class InvalidCredentialsException extends DealerNetException {
  constructor() {
    super('Invalid DealerNet username or password.');
    this.name = 'InvalidCredentialsException';
  }
}

export class SessionExpiredException extends DealerNetException {
  constructor() {
    super('DealerNet session has expired.');
    this.name = 'SessionExpiredException';
  }
}

export class CustomerNotFoundException extends DealerNetException {
  constructor(rut: string) {
    super(`Customer with RUT ${rut} was not found in DealerNet.`);
    this.name = 'CustomerNotFoundException';
  }
}

export class ReportGenerationFailedException extends DealerNetException {
  constructor(reason: string) {
    super(`Failed to generate report: ${reason}`);
    this.name = 'ReportGenerationFailedException';
  }
}
