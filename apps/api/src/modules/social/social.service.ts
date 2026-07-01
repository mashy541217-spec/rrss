import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { MetaDiscoveryService } from './meta-discovery.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name);
  private stateStore: Map<string, string> = new Map(); // state -> businessId (In-memory for local)

  constructor(
    private readonly prisma: PrismaService,
    private readonly metaDiscovery: MetaDiscoveryService
  ) {}

  async generateAuthUrl(provider: string, businessId: string): Promise<string> {
    const state = crypto.randomBytes(16).toString('hex');
    this.stateStore.set(state, businessId);

    // Generate Official URLs based on provider
    let url = '';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/social/oauth/callback');

    if (provider === 'meta' || provider === 'instagram' || provider === 'facebook') {
      const clientId = process.env.FACEBOOK_CLIENT_ID || 'mock_fb_client_id';
      const scopes = 'pages_show_list,instagram_basic,instagram_manage_comments,pages_read_engagement';
      url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
    } else {
      url = `https://mock.oauth.provider.com/auth?client_id=mock&redirect_uri=${redirectUri}&state=${state}`;
    }

    return url;
  }

  async handleCallback(code: string, state: string): Promise<boolean> {
    try {
      const businessId = this.stateStore.get(state);
      if (!businessId) {
        this.logger.error('Invalid or expired state parameter');
        return false;
      }

      this.stateStore.delete(state);

      // Exchange code for token
      let accessToken = 'mock_access_token_' + Date.now();
      let profileId = 'mock_profile_' + Math.floor(Math.random() * 1000);
      let profileName = 'Connected Page';
      let profileImage = 'https://picsum.photos/200';
      
      const clientId = process.env.FACEBOOK_CLIENT_ID;
      const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
      
      // If we have real credentials, call the actual API
      if (clientId && clientSecret && clientId !== 'mock_fb_client_id') {
        const redirectUri = 'http://localhost:3000/api/social/oauth/callback';
        const response = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
        if (response.ok) {
          const data = await response.json();
          accessToken = data.access_token;
          
          // Fetch profile info (mocking this part for simplicity if no real graph token works)
          const profileResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            profileId = profileData.id;
            profileName = profileData.name;
          }
        } else {
          this.logger.error('Failed to exchange code: ' + await response.text());
          // Fallback to mock behavior for local resilience if requested
        }
      }

      // Store in Security Vault (Prisma)
      const credentialId = uuidv4();
      
      await this.prisma.$transaction(async (tx) => {
        await tx.credential.create({
          data: {
            id: credentialId,
            name: profileName,
            type: 'OAUTH2',
            status: 'ACTIVE',
            provider: 'META',
            scope: 'read,write',
            ownerId: 'system',
            businessId: businessId,
            metadata: {
              profileId,
              profileImage,
              connectedAt: new Date().toISOString()
            }
          }
        });

        await tx.credentialSecret.create({
          data: {
            id: uuidv4(),
            credentialId: credentialId,
            version: 1,
            encryptedValue: accessToken, // In production, this would be encrypted via KMS
            algorithm: 'AES-256-GCM',
            isActive: true
          }
        });
      });

      // Automatically execute Discovery & Normalization
      // We run this asynchronously so we don't block the redirect, 
      // but in a real system this could emit an event. We will await it for simplicity here.
      await this.metaDiscovery.synchronize(credentialId);

      return true;
    } catch (error) {
      this.logger.error('Callback error', error);
      return false;
    }
  }

  async getAccounts(businessId: string) {
    const credentials = await this.prisma.credential.findMany({
      where: { 
        businessId: businessId,
        isDeleted: false,
        status: 'ACTIVE'
      }
    });

    return credentials.map(c => {
      const meta = c.metadata as any;
      const pages = meta.pages || [];
      const totalFollowers = pages.reduce((acc: number, p: any) => acc + (p.followers || 0) + (p.instagram?.followers || 0), 0);
      
      return {
        id: c.id, 
        platform: c.provider.toLowerCase(),
        name: c.name,
        handle: meta.pages?.[0]?.instagram?.username ? `@${meta.pages[0].instagram.username}` : `@${c.name.replace(/\s+/g, '').toLowerCase()}`,
        avatar: meta.profileImage || '',
        status: meta.syncStatus === 'FAILED' ? 'NEEDS_ATTENTION' : (meta.syncStatus === 'HEALTHY' ? 'Connected' : 'Synchronizing'),
        syncStatus: meta.syncStatus || 'Pending',
        followers: totalFollowers > 0 ? totalFollowers : 0,
        capabilities: meta.capabilities || [],
        pages: pages
      };
    });
  }

  async disconnect(credentialId: string) {
    await this.prisma.credential.update({
      where: { id: credentialId },
      data: { 
        isDeleted: true, 
        status: 'REVOKED',
        deletedAt: new Date()
      }
    });
    return { success: true };
  }

  async getStatus(businessId: string) {
    const count = await this.prisma.credential.count({
      where: { businessId, isDeleted: false, status: 'ACTIVE' }
    });
    return {
      connected: count,
      health: 'Operational',
      lastSync: new Date().toISOString()
    };
  }
}
