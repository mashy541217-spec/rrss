import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MetaPublishingService {
  private readonly logger = new Logger(MetaPublishingService.name);

  async executePublish(credential: any, publicationId: string, caption: string, imageUrls: string[], targetPageId: string): Promise<boolean> {
    this.logger.log(`Executing Meta Publish for ${publicationId} on target ${targetPageId}`);
    
    const isMock = process.env.MOCK_PUBLISH_LOCAL === 'true' || !process.env.FACEBOOK_CLIENT_ID;

    if (isMock) {
      this.logger.log(`[MOCK PUBLISH] Successfully published to ${targetPageId}. Caption: ${caption}`);
      // Simulate network delay
      await new Promise(res => setTimeout(res, 2000));
      return true;
    }

    // Real Execution
    try {
      const accessToken = credential.secrets[0].encryptedValue;
      
      // Basic Single Image Post for Facebook Page
      // In a full implementation, you'd switch logic based on whether targetPageId is an IG Account or FB Page
      
      if (imageUrls && imageUrls.length > 0) {
        // Post Photo
        const photoUrl = encodeURIComponent(imageUrls[0]);
        const msg = encodeURIComponent(caption || '');
        const res = await fetch(`https://graph.facebook.com/v20.0/${targetPageId}/photos?url=${photoUrl}&message=${msg}&access_token=${accessToken}`, {
          method: 'POST'
        });
        
        if (!res.ok) {
          this.logger.error(`Meta Graph API Error: ${await res.text()}`);
          return false;
        }
        
        const data = await res.json();
        this.logger.log(`Successfully published. Post ID: ${data.id}`);
        return true;
      } else {
        // Post Text Only
        const msg = encodeURIComponent(caption || '');
        const res = await fetch(`https://graph.facebook.com/v20.0/${targetPageId}/feed?message=${msg}&access_token=${accessToken}`, {
          method: 'POST'
        });

        if (!res.ok) {
          this.logger.error(`Meta Graph API Error: ${await res.text()}`);
          return false;
        }

        const data = await res.json();
        this.logger.log(`Successfully published. Post ID: ${data.id}`);
        return true;
      }
    } catch (e) {
      this.logger.error('Failed to publish to Meta', e);
      return false;
    }
  }
}
