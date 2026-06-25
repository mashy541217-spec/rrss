import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/PrismaService';

describe('Vertical Slice 1: Workspace Lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  // Clean DB between tests or use unique identifiers
  const uniqueId = Date.now().toString();
  const testEmail = `admin-${uniqueId}@rrss-auto.com`;
  const workspaceSlug = `agency-${uniqueId}`;
  let createdUserId: string | undefined;
  let createdWorkspaceId: string | undefined;

  const mockPrismaService = {
    workspace: {
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      deleteMany: jest.fn(),
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
    
    // Assign our mocked prisma service
    prisma = app.get(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    // Cleanup the database for created resources
    await prisma.workspace.deleteMany({ where: { slug: workspaceSlug } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await app.close();
  });

  let createdUserId: string | null = null;
  let createdWorkspaceId: string | null = null;

  it('/users (POST) - Register a User', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: testEmail,
        displayName: 'Test Admin',
        password: 'securePassword123'
      })
      .expect(201);
      
    // The response is void from the controller. We must check the DB to verify.
    const userInDb = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    expect(userInDb).toBeDefined();
    expect(userInDb?.displayName).toBe('Test Admin');
    createdUserId = userInDb!.id;
  });

  it('/workspaces (POST) - Create a Workspace', async () => {
    const response = await request(app.getHttpServer())
      .post('/workspaces')
      .send({
        name: 'My Test Agency',
        slug: workspaceSlug,
        timezone: 'America/New_York',
        locale: 'en-US',
        ownerId: createdUserId,
        limits: {
          maxBusinesses: 10,
          maxConcurrentExecutions: 50,
          maxProxies: 5,
          maxVms: 2
        }
      })
      .expect(201);
      
    // The response is void. Check DB to verify it was created.
    const workspaceInDb = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug }
    });
    
    expect(workspaceInDb).toBeDefined();
    expect(workspaceInDb?.name).toBe('My Test Agency');
    expect((workspaceInDb?.settings as any)?.timezone).toBe('America/New_York');
    createdWorkspaceId = workspaceInDb!.id;
  });

  it('/workspaces/:id (GET) - Get Workspace', async () => {
    const response = await request(app.getHttpServer())
      .get(`/workspaces/${createdWorkspaceId}`)
      .expect(200);
      
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(createdWorkspaceId);
    expect(response.body.slug).toBe(workspaceSlug);
  });

  it('/workspaces/:id (PATCH) - Update Settings', async () => {
    await request(app.getHttpServer())
      .patch(`/workspaces/${createdWorkspaceId}`)
      .send({
        timezone: 'Europe/Madrid',
        locale: 'es-ES'
      })
      .expect(200);
      
    const workspaceInDb = await prisma.workspace.findUnique({
      where: { id: createdWorkspaceId! }
    });
    
    expect((workspaceInDb?.settings as any)?.timezone).toBe('Europe/Madrid');
    expect((workspaceInDb?.settings as any)?.locale).toBe('es-ES');
  });
});
