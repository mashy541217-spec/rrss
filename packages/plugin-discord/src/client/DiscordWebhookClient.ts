export class DiscordWebhookClient {
  constructor(private readonly webhookUrl: string, private readonly options?: { mock?: boolean }) {}

  public async executeWebhook(content: string, embeds?: any[]): Promise<any> {
    if (this.options?.mock) {
      return { success: true };
    }
    throw new Error('Real HTTP client not implemented for Phase 3');
  }
}
