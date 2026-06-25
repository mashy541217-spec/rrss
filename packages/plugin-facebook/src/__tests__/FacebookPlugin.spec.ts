import { FacebookPlugin } from '../plugin/FacebookPlugin';
import { FacebookFeatureFlags } from '../plugin/FacebookFeatureFlags';

describe('Facebook Provider Plugin', () => {
  let plugin: FacebookPlugin;
  const mockConfig = {
    settings: { appId: 'mock-app-123' },
    credentials: { token: 'mock-access-token' }
  };
  const mockContext: any = { logger: { info: jest.fn() } };

  beforeEach(() => {
    plugin = new FacebookPlugin({ mock: true });
  });

  describe('Feature Flags', () => {
    it('should expose correct feature flags', () => {
      expect(FacebookFeatureFlags.SupportsPages).toBe(true);
      expect(FacebookFeatureFlags.SupportsLinks).toBe(true);
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
        targetId: 'page-1',
        text: 'Hello Facebook!',
        mediaUrls: []
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.url).toContain('https://facebook.com/');
    });

    it('should publish photos successfully', async () => {
      const params = {
        targetId: 'page-1',
        text: 'Photo post',
        mediaUrls: ['https://mock.url/image.jpg']
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.externalId).toBeDefined();
    });
  });
});
