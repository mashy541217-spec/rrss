export interface CreateLeadInput {
  readonly email: string;
  readonly name?: string;
  readonly phone?: string;
  readonly customFields?: Record<string, any>;
}

export interface CreateLeadOutput {
  readonly success: boolean;
  readonly externalLeadId: string;
}
