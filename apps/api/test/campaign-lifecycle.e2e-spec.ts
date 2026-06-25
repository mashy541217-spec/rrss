import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/PrismaService';

describe('Sprint 5.3: Campaign Platform Lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const uniqueId = Date.now().toString();
  const testWorkspaceRef = `workspace-${uniqueId}`;
  let createdCampaignId: string | undefined;
  let createdChannelId: string | undefined;
  let createdPublicationId: string | undefined;

  const mockPrismaService = {
    campaign: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
    },
    publication: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    campaignChannel: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    campaignContent: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    campaignExecution: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    campaignMetricSnapshot: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    outboxMessage: {
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(async (cb) => {
      return cb(mockPrismaService);
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
    
    prisma = app.get(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/campaigns (POST) - Create Campaign', async () => {
    const response = await request(app.getHttpServer())
      .post('/campaigns')
      .send({
        workspaceRef: testWorkspaceRef,
        name: 'Summer SaaS Launch',
        description: 'Launching our brand new scheduler features!',
        priority: 'High',
        objective: 'BrandAwareness',
        strategy: 'Scheduled',
        tags: ['saas', 'marketing', 'summer'],
        budgetLimit: 5000,
        budgetCurrency: 'USD',
        budgetType: 'TOTAL',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    createdCampaignId = response.body.id;
  });

  it('/campaigns/:id/channels (POST) - Add publication channel', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 5000, currency: { code: 'USD' } }, type: 'TOTAL' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/channels`)
      .send({
        platform: 'Instagram',
        type: 'Reel',
        configuration: { aspect_ratio: '16:9', audio: 'trending' },
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdChannelId = response.body.id;
  });

  it('/campaigns/:id/contents (POST) - Attach content', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 5000, currency: { code: 'USD' } }, type: 'TOTAL' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 2,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/contents`)
      .send({
        contentId: 'content-12345',
        attachedBy: 'user-999',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/budget (POST) - Configure budget', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 5000, currency: { code: 'USD' } }, type: 'TOTAL' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 3,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/budget`)
      .send({
        limitAmount: 7500,
        currency: 'USD',
        budgetType: 'DAILY',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/schedule (POST) - Schedule campaign', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 4,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/schedule`)
      .send({
        startDate: new Date(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        cron: '0 9 * * *',
        timezone: 'UTC',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/audience (POST) - Update audience', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 5,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/audience`)
      .send({
        name: 'Tech Enthusiasts',
        segments: ['developers', 'early-adopters'],
        rules: { min_age: 18 },
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/strategy (PATCH) - Update strategy', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 6,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .patch(`/campaigns/${createdCampaignId}/strategy`)
      .send({
        strategy: 'Triggered',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/activate (POST) - Activate campaign', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Draft',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Triggered',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      channels: [
        { id: createdChannelId, platform: 'Instagram', type: 'Reel', configuration: {} }
      ],
      contents: [
        { id: 'cc-1', contentId: 'content-12345', attachedAt: new Date(), attachedBy: 'user-999' }
      ],
      version: 7,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/activate`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/publications (POST) - Generate platform-independent publication', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Ready',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Triggered',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      channels: [],
      contents: [],
      version: 8,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/publications`)
      .send({
        contentId: 'content-12345',
        format: 'POST',
        publishAt: new Date(),
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdPublicationId = response.body.id;
  });

  it('/campaigns/:id/pause (POST) - Pause campaign', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Running',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Triggered',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 9,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/pause`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id/complete (POST) - Complete campaign', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Running',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Triggered',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 10,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post(`/campaigns/${createdCampaignId}/complete`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/campaigns/:id (DELETE) - Archive campaign', async () => {
    expect(createdCampaignId).toBeDefined();

    mockPrismaService.campaign.findFirst.mockResolvedValueOnce({
      id: createdCampaignId,
      workspaceRef: testWorkspaceRef,
      name: 'Summer SaaS Launch',
      status: 'Completed',
      priority: 'High',
      objective: 'BrandAwareness',
      strategy: 'Triggered',
      tags: ['saas', 'marketing', 'summer'],
      budget: {
        amount: { limit: { amount: 7500, currency: { code: 'USD' } }, type: 'DAILY' },
        spent: { amount: 0, currency: { code: 'USD' } }
      },
      version: 11,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .delete(`/campaigns/${createdCampaignId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
