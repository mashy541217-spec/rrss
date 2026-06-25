import { ThreadsPlugin } from '../plugin/ThreadsPlugin';
import { ThreadsFeatureFlags } from '../plugin/ThreadsFeatureFlags';

describe('Threads Provider Plugin', () => {
  let plugin: ThreadsPlugin;
  const mockConfig = {
    settings: { appId: 'mock-app-123' },
    credentials: { token: 'mock-access-token' }
  };
  const mockContext: any = { logger: { info: jest.fn() } };

  beforeEach(() => {
    plugin = new ThreadsPlugin({ mock: true });
  });

  describe('Feature Flags', () => {
    it('should expose correct feature flags', () => {
      expect(ThreadsFeatureFlags.SupportsTextPosts).toBe(true);
      expect(ThreadsFeatureFlags.SupportsReplies).toBe(true);
    });
  });

  describe('Health Checks', () => {
    it('should pass health checks when token is valid', async () => {
      const status = await plugin.checkHealth(mockContext, mockConfig);
      expect(status.isHealthy).toBe(true);
      expect(status.message).toContain('ACTIVE');
    });

    it('should report unhealthy on unauthorized', async () => {
      const invalidConfig = { settings: {}, credentials: { token: '' } };
      const status = await plugin.checkHealth(mockContext, invalidConfig);
      expect(status.isHealthy).toBe(false);
      expect(status.message).toContain('UNAUTHORIZED');
    });
  });

  describe('Actions Execution', () => {
    it('should publish text content successfully', async () => {
      const params = {
        targetId: 'me',
        text: 'Hello Threads!',
        mediaUrls: []
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.url).toContain('threads.net/');
    });

    it('should publish photos successfully', async () => {
      const params = {
        targetId: 'me',
        text: 'Photo post',
        mediaUrls: ['https://mock.url/image.jpg']
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.externalId).toBeDefined();
    });
  });
});
