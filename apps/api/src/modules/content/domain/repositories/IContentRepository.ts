import { Content } from '../aggregate/Content';
import { ContentId } from '../value-objects/ContentId';

export interface IContentRepository {
  save(content: Content): Promise<void>;
  findById(id: ContentId): Promise<Content | null>;
  findByWorkspace(workspaceRef: string): Promise<Content[]>;
  delete(id: ContentId): Promise<void>;
}
