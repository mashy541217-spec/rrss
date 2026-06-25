import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/PrismaService';

describe('Sprint 5.1: Credentials Platform Lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const uniqueId = Date.now().toString();
  let createdCredentialId: string | undefined;

  const mockPrismaService = {
    credential: {
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(async (cb) => {
      return cb({
        credential: {
          findUnique: jest.fn().mockResolvedValue(null),
          upsert: jest.fn().mockResolvedValue({}),
        },
        credentialSecret: {
          upsert: jest.fn().mockResolvedValue({}),
        }
      });
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

  it('/credentials (POST) - Create a Credential', async () => {
    const payload = {
      name: `Test Credential ${uniqueId}`,
      type: 'OAUTH2_TOKEN',
      provider: 'SYSTEM',
      scope: 'WORKSPACE',
      ownerId: `workspace-${uniqueId}`,
      plainTextSecret: 'super-secret-oauth-token-12345',
      metadata: {
        clientId: 'test-client',
        redirectUri: 'https://app.test.com/oauth/callback'
      },
      policy: {
        rotationPolicy: 'AUTO_90_DAYS',
        requiresMfa: true
      }
    };

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    createdCredentialId = response.body.id;
  });

  it('/credentials/:id/rotate (POST) - Rotate Credential Secret', async () => {
    expect(createdCredentialId).toBeDefined();

    // Mock finding the credential for rotation
    mockPrismaService.credential.findUnique.mockResolvedValueOnce({
      id: createdCredentialId,
      name: 'Test Credential',
      type: 'OAUTH2_TOKEN',
      status: 'ACTIVE',
      provider: 'SYSTEM',
      scope: 'WORKSPACE',
      ownerId: 'workspace-123',
      metadata: {},
      policy: { rotationPolicy: 'MANUAL' },
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      secrets: [
        {
          id: 'secret-1',
          credentialId: createdCredentialId,
          version: 1,
          encryptedValue: 'c29tZV9iYXNlNjRfZGF0YQ==',
          algorithm: 'PLAINTEXT',
          isActive: true,
          createdAt: new Date()
        }
      ] as any // Mock type workaround
    });

    const response = await request(app.getHttpServer())
      .post(`/credentials/${createdCredentialId}/rotate`)
      .send({
        plainTextSecret: 'new-rotated-secret-67890'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/credentials/:id/metadata (PATCH) - Update Metadata', async () => {
    expect(createdCredentialId).toBeDefined();

    mockPrismaService.credential.findUnique.mockResolvedValueOnce({
      id: createdCredentialId,
      name: 'Test Credential',
      type: 'OAUTH2_TOKEN',
      status: 'ACTIVE',
      provider: 'SYSTEM',
      scope: 'WORKSPACE',
      ownerId: 'workspace-123',
      metadata: {},
      policy: { rotationPolicy: 'MANUAL' },
      version: 2,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      secrets: []
    });

    const response = await request(app.getHttpServer())
      .patch(`/credentials/${createdCredentialId}/metadata`)
      .send({
        metadata: {
          newKey: 'newValue'
        }
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('/credentials/:id (DELETE) - Revoke Credential', async () => {
    expect(createdCredentialId).toBeDefined();

    mockPrismaService.credential.findUnique.mockResolvedValueOnce({
      id: createdCredentialId,
      name: 'Test Credential',
      type: 'OAUTH2_TOKEN',
      status: 'ACTIVE',
      provider: 'SYSTEM',
      scope: 'WORKSPACE',
      ownerId: 'workspace-123',
      metadata: {},
      policy: { rotationPolicy: 'MANUAL' },
      version: 3,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      secrets: []
    });

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${createdCredentialId}`)
      .send({
        reason: 'Compromised'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
