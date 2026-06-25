export interface CreateCampaignInput {
  readonly name: string;
  readonly objective: string;
  readonly budget: number;
}

export interface CreateCampaignOutput {
  readonly success: boolean;
  readonly externalCampaignId: string;
}
