import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { PublicationUpdated, PublicationInsightUpdated } from '../../campaign/domain/events/SocialFeedbackEvents';

@Injectable()
export class PublicationResolverService {
  private readonly logger = new Logger(PublicationResolverService.name);

  constructor(private readonly eventBus: EventBus) {}

  public async resolveMetaFeedback(payload: any): Promise<void> {
    this.logger.log('Resolving Meta feedback payload');
    
    // Simplistic mock parsing of a Meta webhook payload
    // A real implementation would iterate entry -> changes -> value
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) return;

    // Simulate mapping external ID to internal Publication ID
    const externalId = value.post_id;
    const internalPublicationId = `pub_${externalId}`; // Mock mapping

    if (changes.field === 'status') {
      this.logger.log(`Status update for ${internalPublicationId}: ${value.status}`);
      this.eventBus.publish(new PublicationUpdated(internalPublicationId, value.status));
    } else if (changes.field === 'insights') {
      const metrics = {
        likes: value.likes || 0,
        comments: value.comments || 0,
        impressions: value.impressions || 0,
      };
      this.logger.log(`Insights update for ${internalPublicationId}`);
      this.eventBus.publish(new PublicationInsightUpdated(internalPublicationId, metrics));
    }
  }
}
