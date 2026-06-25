export interface SecurityEvent {
  eventId: string;
  timestamp: Date;
  eventType: 'AuthenticationFailed' | 'ApiAbuse' | 'PermissionViolation' | 'CredentialRotated' | 'SuspiciousActivity';
  subjectId: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}
