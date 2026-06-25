import { Content } from '../aggregate/Content';
import { ContentStatus } from '../enums/ContentStatus';

/**
 * RetentionPolicy governs when content can be permanently deleted vs soft-deleted.
 */
export class RetentionPolicy {
  constructor(private readonly retentionDays: number = 90) {}

  public canPermanentlyDelete(content: Content): boolean {
    if (!content.isDeleted || !content.deletedAt) return false;
    const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;
    return Date.now() - content.deletedAt.getTime() >= retentionMs;
  }

  public canArchive(content: Content): boolean {
    return content.status !== ContentStatus.ARCHIVED && !content.isDeleted;
  }
}
