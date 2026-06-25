import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/PrismaService';

describe('Sprint 5.2: Content Platform Lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const uniqueId = Date.now().toString();
  const testWorkspaceRef = `workspace-${uniqueId}`;
  const testUser = `user-${uniqueId}`;

  let createdContentId: string | undefined;
  let createdAssetId: string | undefined;

  const mockPrismaService = {
    content: {
      upsert: jest.fn().mockImplementation((args) => {
        return Promise.resolve({
          id: args.where.id,
          ...args.create,
        });
      }),
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    asset: {
      upsert: jest.fn().mockImplementation((args) => {
        return Promise.resolve({
          id: args.where.id,
          ...args.create,
        });
      }),
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    mediaFile: {
      upsert: jest.fn().mockImplementation((args) => {
        return Promise.resolve({
          id: args.where.id,
          ...args.create,
        });
      }),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
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

  it('/content (POST) - Create Content', async () => {
    const response = await request(app.getHttpServer())
      .post('/content')
      .send({
        workspaceRef: testWorkspaceRef,
        createdBy: testUser,
        title: 'Draft Campaign Post',
        body: 'Welcome to the new launch of RRSS Auto!',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    createdContentId = response.body.id;
  });

  it('/assets (POST) - Upload Media Asset', async () => {
    const response = await request(app.getHttpServer())
      .post('/assets')
      .send({
        workspaceRef: testWorkspaceRef,
        uploadedBy: testUser,
        mediaCategory: 'IMAGE',
        mimeType: 'image/png',
        fileSizeBytes: 2048576,
        url: 'https://cdn.rrss-auto.com/assets/logo.png',
        visibility: 'WORKSPACE',
        tags: ['logo', 'brand'],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    createdAssetId = response.body.id;
  });

  it('/content/:id/metadata (PATCH) - Update Content Metadata', async () => {
    expect(createdContentId).toBeDefined();

    mockPrismaService.content.findUnique.mockResolvedValueOnce({
      id: createdContentId,
      workspaceRef: testWorkspaceRef,
      status: 'DRAFT',
      title: 'Draft Campaign Post',
      body: 'Welcome to the new launch of RRSS Auto!',
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        caption: 'Caption draft',
        hashtags: ['new', 'launch'],
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Desc',
        tags: ['tag1'],
      },
    });

    const response = await request(app.getHttpServer())
      .patch(`/content/${createdContentId}/metadata`)
      .send({
        updatedBy: testUser,
        caption: 'Final Launch Caption!',
        hashtags: ['launch', 'rrssauto', 'saas'],
        seoTitle: 'RRSS Auto - Launching Now',
        seoDescription: 'Discover the power of automated social media execution.',
        tags: ['marketing', 'launch'],
        thumbnailAssetId: createdAssetId,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/content/:id/localizations (POST) - Add Localization', async () => {
    expect(createdContentId).toBeDefined();

    mockPrismaService.content.findUnique.mockResolvedValueOnce({
      id: createdContentId,
      workspaceRef: testWorkspaceRef,
      status: 'DRAFT',
      title: 'Draft Campaign Post',
      body: 'Welcome to the new launch of RRSS Auto!',
      version: 2,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    });

    const response = await request(app.getHttpServer())
      .post(`/content/${createdContentId}/localizations`)
      .send({
        languageCode: 'es-ES',
        caption: '¡Bienvenidos al nuevo lanzamiento de RRSS Auto!',
        addedBy: testUser,
        title: 'Publicación de Campaña en Español',
        body: '¡Descubre el poder de la automatización!',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });

  it('/content/:id/duplicate (POST) - Duplicate Content', async () => {
    expect(createdContentId).toBeDefined();

    mockPrismaService.content.findUnique.mockResolvedValueOnce({
      id: createdContentId,
      workspaceRef: testWorkspaceRef,
      status: 'DRAFT',
      title: 'Draft Campaign Post',
      body: 'Welcome to the new launch of RRSS Auto!',
      version: 2,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    });

    const response = await request(app.getHttpServer())
      .post(`/content/${createdContentId}/duplicate`)
      .send({
        workspaceRef: testWorkspaceRef,
        duplicatedBy: testUser,
        newTitle: 'Duplicated Campaign Post',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
  });

  it('/content/:id/archive (POST) - Archive Content', async () => {
    expect(createdContentId).toBeDefined();

    mockPrismaService.content.findUnique.mockResolvedValueOnce({
      id: createdContentId,
      workspaceRef: testWorkspaceRef,
      status: 'DRAFT',
      title: 'Draft Campaign Post',
      body: 'Welcome to the new launch of RRSS Auto!',
      version: 3,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    });

    const response = await request(app.getHttpServer())
      .post(`/content/${createdContentId}/archive`)
      .send({
        archivedBy: testUser,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/publication-profiles (POST) - Generate Publication Profile', async () => {
    const response = await request(app.getHttpServer())
      .post('/publication-profiles')
      .send({
        workspaceRef: testWorkspaceRef,
        name: 'Instagram Business Profile',
        createdBy: testUser,
        platforms: ['INSTAGRAM'],
        defaultFormat: 'REEL',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
  });
});
