export interface UpdateCampaignInput {
  readonly externalCampaignId: string;
  readonly name?: string;
  readonly budget?: number;
  readonly status?: string;
}

export interface UpdateCampaignOutput {
  readonly success: boolean;
}
