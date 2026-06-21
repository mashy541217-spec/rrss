export class InfrastructureException extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = 'INFRASTRUCTURE_ERROR', details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
