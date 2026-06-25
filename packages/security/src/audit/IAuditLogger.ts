import { SecurityEvent } from './SecurityEvent';

export interface IAuditLogger {
  logSecurityEvent(event: SecurityEvent): void;
}
