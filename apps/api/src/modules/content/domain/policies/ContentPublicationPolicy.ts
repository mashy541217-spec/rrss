import { Content } from '../aggregate/Content';
import { ContentStatus } from '../enums/ContentStatus';

export class ContentPublicationPolicy {
  /**
   * Determines whether content is eligible to transition to PUBLISHED state.
   * Rules are platform-agnostic: they validate the content itself, not any platform specifics.
   */
  public canPublish(content: Content): { allowed: boolean; reason?: string } {
    if (content.isDeleted) return { allowed: false, reason: 'Content has been deleted' };
    if (content.status !== ContentStatus.READY) {
      return { allowed: false, reason: `Content must be READY to publish. Current: ${content.status}` };
    }
    if (!content.title && !content.body) {
      return { allowed: false, reason: 'Content must have at least a title or body' };
    }
    return { allowed: true };
  }
}
