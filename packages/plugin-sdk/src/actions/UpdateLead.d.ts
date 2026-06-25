export interface UpdateLeadInput {
    readonly externalLeadId: string;
    readonly name?: string;
    readonly status?: string;
    readonly customFields?: Record<string, any>;
}
export interface UpdateLeadOutput {
    readonly success: boolean;
}
