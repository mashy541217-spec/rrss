export class SlackWebhookClient {
  constructor(private readonly webhookUrl: string, private readonly options?: { mock?: boolean }) {}

  public async sendPayload(payload: any): Promise<any> {
    if (this.options?.mock) {
      return { ok: true };
    }
    throw new Error('Real HTTP client not implemented for Phase 3');
  }
}
