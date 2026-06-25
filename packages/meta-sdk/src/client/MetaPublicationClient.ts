import { MetaBaseClient } from './MetaBaseClient';

export class MetaPublicationClient extends MetaBaseClient {
  public async publishMediaContainer(instagramBusinessAccountId: string, creationId: string): Promise<{ id: string }> {
    return this.post<{ id: string }>(`${instagramBusinessAccountId}/media_publish`, {
      creation_id: creationId
    });
  }

  public async getPublicationDetails(mediaId: string): Promise<{ id: string; permalink: string; timestamp: string; media_type: string }> {
    return this.get<{ id: string; permalink: string; timestamp: string; media_type: string }>(mediaId, {
      fields: 'id,permalink,timestamp,media_type'
    });
  }

  public async deletePublication(mediaId: string): Promise<{ success: boolean }> {
    return this.deleteRequest<{ success: boolean }>(mediaId);
  }
}
