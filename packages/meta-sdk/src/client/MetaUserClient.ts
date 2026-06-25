import { MetaBaseClient } from './MetaBaseClient';

export interface MetaUserProfile {
  id: string;
  username: string;
  name: string;
  biography?: string;
  followers_count?: number;
  is_verified?: boolean;
  profile_picture_url?: string;
}

export class MetaUserClient extends MetaBaseClient {
  public async getUserProfile(userId: string): Promise<MetaUserProfile> {
    return this.get<MetaUserProfile>(userId, {
      fields: 'id,username,name,biography,followers_count,is_verified,profile_picture_url'
    });
  }

  public async getLinkedInstagramAccounts(): Promise<any> {
    return this.get<any>('me/accounts', {
      fields: 'id,name,instagram_business_account'
    });
  }

  public async getComments(mediaId: string): Promise<any> {
    return this.get<any>(`${mediaId}/comments`);
  }

  public async replyComment(commentId: string, message: string): Promise<any> {
    return this.post<any>(`${commentId}/replies`, { message });
  }
}
