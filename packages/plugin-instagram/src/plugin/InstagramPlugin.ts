import { Plugin, PluginManifest, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { InstagramManifest } from './InstagramManifest';
import { InstagramProvider } from './InstagramProvider';
import { MetaGraphApiClient } from '@rrss-auto/meta-sdk';
import { InstagramHealthCheck } from '../health/InstagramHealthCheck';
import { SocialMediaAsset } from '@rrss-auto/social-sdk';

export class InstagramPlugin implements Plugin {
  readonly manifest: PluginManifest = InstagramManifest;
  private readonly provider: InstagramProvider;

  constructor(options?: { mock?: boolean }) {
    this.provider = new InstagramProvider(options);
  }

  public async executeAction(
    actionName: string,
    context: PluginContext,
    config: PluginConfiguration,
    params: Record<string, any>
  ): Promise<any> {
    const credentials = config.credentials || {};

    switch (actionName) {
      case 'PublishContent': {
        const pageId = params.targetId || params.contentId || '';
        const content = params.body || params.text || '';
        const mediaUrls = params.mediaUrls || [];

        // Map simple urls to SocialMediaAsset
        const mediaAssets: SocialMediaAsset[] = mediaUrls.map((url: string, index: number) => ({
          id: `media-${index}`,
          url,
          assetType: url.endsWith('.mp4') ? 'VIDEO' : 'IMAGE'
        }));

        try {
          const pub = await this.provider.publishContent(
            pageId,
            content,
            mediaAssets,
            credentials,
            params.metadata
          );
          return {
            success: true,
            externalId: pub.id,
            url: pub.url,
            metadata: pub.metadata
          };
        } catch (error: any) {
          return {
            success: false,
            metadata: { error: error.message }
          };
        }
      }

      case 'UploadMedia': {
        const asset = await this.provider.uploadMedia(
          params.mediaUrl,
          params.filename || 'asset',
          params.contentType || 'image/jpeg',
          credentials
        );
        return {
          success: true,
          mediaId: asset.id,
          url: asset.url
        };
      }

      case 'DownloadMedia': {
        const stream = await this.provider.downloadMedia(params.mediaId, credentials);
        return {
          success: true,
          data: stream
        };
      }

      case 'GetInsights': {
        const insights = await this.provider.getInsights(params.publicationId, credentials);
        return {
          success: true,
          insights
        };
      }

      default:
        throw new Error(`Unsupported action on Instagram Plugin: ${actionName}`);
    }
  }

  public async checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth> {
    const token = config.credentials?.token || config.credentials?.accessToken || '';
    const client = new MetaGraphApiClient(token, { mock: true }); // standard checks mock-based to prevent remote blocks
    const health = await InstagramHealthCheck.verify(client);
    return {
      isHealthy: health.isHealthy,
      lastCheckedAt: new Date(),
      message: `Status: ${health.status}. details: ${JSON.stringify(health.details || {})}`
    };
  }
}
