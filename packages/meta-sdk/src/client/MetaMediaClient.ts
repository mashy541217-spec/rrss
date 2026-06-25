import { MetaBaseClient } from './MetaBaseClient';

export class MetaMediaClient extends MetaBaseClient {
  public async createPhotoContainer(instagramBusinessAccountId: string, imageUrl: string, caption?: string): Promise<{ id: string }> {
    return this.post<{ id: string }>(`${instagramBusinessAccountId}/media`, {
      image_url: imageUrl,
      caption
    });
  }

  public async createVideoContainer(instagramBusinessAccountId: string, videoUrl: string, caption?: string): Promise<{ id: string }> {
    return this.post<{ id: string }>(`${instagramBusinessAccountId}/media`, {
      media_type: 'REELS',
      video_url: videoUrl,
      caption
    });
  }

  public async createCarouselContainer(instagramBusinessAccountId: string, childrenContainerIds: string[], caption?: string): Promise<{ id: string }> {
    return this.post<{ id: string }>(`${instagramBusinessAccountId}/media`, {
      media_type: 'CAROUSEL',
      children: childrenContainerIds,
      caption
    });
  }

  public async getContainerStatus(containerId: string): Promise<{ id: string; status_code: 'FINISHED' | 'IN_PROGRESS' | 'ERROR' }> {
    return this.get<{ id: string; status_code: 'FINISHED' | 'IN_PROGRESS' | 'ERROR' }>(containerId, {
      fields: 'id,status_code'
    });
  }
}
