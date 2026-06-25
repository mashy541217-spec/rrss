import { MetaMediaClient } from '../client/MetaMediaClient';

export interface MetaMediaPipelineOptions {
  maxAttempts?: number;
  delayMs?: number;
}

export class MetaMediaPipeline {
  constructor(private readonly mediaClient: MetaMediaClient) {}

  public async waitForContainerReady(
    containerId: string,
    options: MetaMediaPipelineOptions = {}
  ): Promise<boolean> {
    const maxAttempts = options.maxAttempts || 10;
    const delayMs = options.delayMs || 50; // Use small delay by default for testing
    let attempts = 0;
    let isReady = false;

    while (!isReady && attempts < maxAttempts) {
      attempts++;
      const status = await this.mediaClient.getContainerStatus(containerId);
      
      if (status.status_code === 'FINISHED') {
        isReady = true;
      } else if (status.status_code === 'ERROR') {
        throw new Error(`Media container processing failed for container ${containerId}`);
      } else {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    if (!isReady) {
      throw new Error(`Media processing timeout exceeded for container ${containerId}`);
    }

    return isReady;
  }
}
