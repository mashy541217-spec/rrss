import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

@Injectable()
export class MetaDiscoveryService {
  private readonly logger = new Logger(MetaDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async synchronize(credentialId: string): Promise<boolean> {
    try {
      this.logger.log(`Starting synchronization for credential ${credentialId}`);
      
      const credential = await this.prisma.credential.findUnique({
        where: { id: credentialId },
        include: { secrets: true }
      });

      if (!credential || !credential.secrets || credential.secrets.length === 0) {
        this.logger.error(`Credential ${credentialId} not found or missing secrets`);
        return false;
      }

      // In production, KMS decryption would happen here. For now we use the stored value.
      const accessToken = credential.secrets[0].encryptedValue;

      // Real or Mocked graph API discovery
      const isMockBypass = process.env.MOCK_META_LOCAL === 'true' || !process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID === 'mock_fb_client_id';

      let pages: any[] = [];
      let profileData: any = {};

      if (isMockBypass) {
        this.logger.log('Using local mock bypass for Meta Graph API');
        profileData = {
          id: credential.metadata?.['profileId'] || '123456789',
          name: credential.name,
          picture: { data: { url: 'https://picsum.photos/300' } }
        };
        
        pages = [
          {
            id: 'page_123',
            name: `${credential.name} Official Page`,
            category: 'Brand',
            followers_count: Math.floor(Math.random() * 100000) + 5000,
            instagram_business_account: {
              id: 'ig_123',
              username: credential.name.toLowerCase().replace(/\s/g, ''),
              followers_count: Math.floor(Math.random() * 150000) + 10000
            },
            permissions: ['CREATE_CONTENT', 'MANAGE', 'READ_INSIGHTS']
          }
        ];
      } else {
        // Real implementation
        // 1. Fetch user
        const userRes = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,picture&access_token=${accessToken}`);
        if (userRes.ok) {
          profileData = await userRes.json();
        }

        // 2. Fetch pages & IG accounts
        const pagesRes = await fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,name,category,followers_count,instagram_business_account{id,username,followers_count,profile_picture_url},tasks&access_token=${accessToken}`);
        if (pagesRes.ok) {
          const pagesJson = await pagesRes.json();
          pages = pagesJson.data || [];
        }
      }

      // Normalize data
      const normalizedCapabilities = ['PUBLISH_REELS', 'PUBLISH_STORIES', 'MANAGE_COMMENTS', 'DIRECT_MESSAGES'];
      
      const newMetadata = {
        ...(credential.metadata as Record<string, any>),
        profileId: profileData.id,
        profileImage: profileData.picture?.data?.url || (isMockBypass ? 'https://picsum.photos/300' : null),
        syncStatus: 'HEALTHY',
        lastSyncAt: new Date().toISOString(),
        pages: pages.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          followers: p.followers_count,
          permissions: p.tasks || p.permissions || [],
          instagram: p.instagram_business_account ? {
            id: p.instagram_business_account.id,
            username: p.instagram_business_account.username,
            followers: p.instagram_business_account.followers_count,
            avatar: p.instagram_business_account.profile_picture_url || 'https://picsum.photos/300'
          } : null
        })),
        capabilities: normalizedCapabilities
      };

      // Update Database
      await this.prisma.credential.update({
        where: { id: credentialId },
        data: {
          metadata: newMetadata
        }
      });

      this.logger.log(`Synchronization complete for credential ${credentialId}`);
      return true;

    } catch (e) {
      this.logger.error(`Failed to synchronize credential ${credentialId}`, e);
      // Mark as failed in DB
      await this.prisma.credential.update({
        where: { id: credentialId },
        data: {
          metadata: {
            syncStatus: 'FAILED',
            lastSyncAttempt: new Date().toISOString(),
            syncError: e.message
          }
        }
      });
      return false;
    }
  }
}
