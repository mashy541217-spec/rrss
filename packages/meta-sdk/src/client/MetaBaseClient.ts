export class MetaBaseClient {
  constructor(
    protected readonly accessToken: string,
    protected readonly options?: { mock?: boolean }
  ) {}

  public async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Graph API error: 401 Unauthorized (No access token)');
    }
    if (this.options?.mock) {
      return this.mockGet<T>(path, params);
    }
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`https://graph.facebook.com/v19.0/${path}${query}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!response.ok) {
      throw new Error(`Graph API GET error: ${response.statusText} (${response.status})`);
    }
    return response.json() as Promise<T>;
  }

  public async post<T>(path: string, body?: any, params?: Record<string, string>): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Graph API error: 401 Unauthorized (No access token)');
    }
    if (this.options?.mock) {
      return this.mockPost<T>(path, body, params);
    }
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`https://graph.facebook.com/v19.0/${path}${query}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) {
      throw new Error(`Graph API POST error: ${response.statusText} (${response.status})`);
    }
    return response.json() as Promise<T>;
  }

  protected async deleteRequest<T>(path: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Graph API error: 401 Unauthorized (No access token)');
    }
    if (this.options?.mock) {
      return this.mockDelete<T>(path);
    }
    const response = await fetch(`https://graph.facebook.com/v19.0/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!response.ok) {
      throw new Error(`Graph API DELETE error: ${response.statusText} (${response.status})`);
    }
    return response.json() as Promise<T>;
  }

  private mockGet<T>(path: string, params?: Record<string, string>): T {
    if (!this.accessToken) {
      throw new Error('Graph API error: 401 Unauthorized (No access token)');
    }
    if (path.includes('/me') || path.includes('/accounts') || path === 'me' || path.includes('me/')) {
      return {
        id: 'mock-instagram-user-id',
        username: 'mock_instagram_username',
        name: 'Mock Instagram Name',
        biography: 'Mock Bio',
        followers_count: 5000,
        is_verified: true,
        profile_picture_url: 'https://mock.url/profile.png'
      } as any;
    }
    if (path.includes('/insights')) {
      return {
        data: [
          { name: 'impressions', values: [{ value: 120 }] },
          { name: 'reach', values: [{ value: 100 }] },
          { name: 'likes', values: [{ value: 50 }] },
          { name: 'comments', values: [{ value: 15 }] },
          { name: 'shares', values: [{ value: 5 }] },
          { name: 'saved', values: [{ value: 2 }] },
          { name: 'video_views', values: [{ value: 0 }] }
        ]
      } as any;
    }
    if (path.includes('/comments')) {
      return {
        data: [
          { id: 'comment-1', text: 'Nice pic!', timestamp: new Date().toISOString(), username: 'user1' }
        ]
      } as any;
    }
    if (path.startsWith('mock-container-id') || path.includes('container-id')) {
      return {
        id: path,
        status_code: 'FINISHED'
      } as any;
    }
    if (path.startsWith('mock-post-id') || path.includes('post-id') || path.includes('mock-pub') || path.startsWith('post-') || path.includes('pub-')) {
      return {
        id: path,
        permalink: 'https://instagram.com/p/mockpermalink',
        timestamp: new Date().toISOString(),
        media_type: 'IMAGE',
        status_code: 'FINISHED'
      } as any;
    }
    if (path.includes('whatsapp_business_profile')) {
      return { data: [{ id: 'wa-business-profile-id' }] } as any;
    }
    if (/^\d+$/.test(path)) {
      return { id: path, name: 'Mock Page', access_token: 'mock-page-token' } as any;
    }
    throw new Error(`Mock GET not implemented for path: ${path}`);
  }

  private mockPost<T>(path: string, body?: any, params?: Record<string, string>): T {
    if (path.endsWith('/media')) {
      return { id: `mock-container-id-${Date.now()}` } as any;
    }
    if (path.endsWith('/media_publish')) {
      return { id: `mock-post-id-${Date.now()}` } as any;
    }
    if (path.includes('/comments')) {
      return { id: `mock-reply-comment-id-${Date.now()}`, text: body?.message || 'reply' } as any;
    }
    if (path.endsWith('/feed') || path.endsWith('/photos') || path.endsWith('/threads')) {
      return { id: `mock-post-id-${Date.now()}` } as any;
    }
    if (path.includes('/messages')) {
      return { messages: [{ id: `wamid-${Date.now()}` }] } as any;
    }
    return { success: true } as any;
  }

  private mockDelete<T>(path: string): T {
    return { success: true } as any;
  }
}
