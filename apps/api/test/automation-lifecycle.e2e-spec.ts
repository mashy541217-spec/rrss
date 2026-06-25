import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/PrismaService';

describe('Sprint 5.4: Automation Builder Lifecycle (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const uniqueId = Date.now().toString();
  const testWorkspaceRef = `workspace-${uniqueId}`;
  let createdAutomationId: string | undefined;

  const mockPrismaService = {
    automation: {
      findUnique: jest.fn(),
      findFirst: jest.fn().mockImplementation((args) => Promise.resolve({
        id: args.where.id,
        workspaceRef: testWorkspaceRef,
        name: 'Saas Auto Workflow',
        description: 'Auto launch sequences',
        status: 'Draft',
        variables: [],
        trigger: null,
        retryConfig: null,
        timeoutConfig: null,
        executionPlan: null,
        version: 1,
        isDeleted: false,
        nodes: [],
        connections: [],
      })),
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
    },
    workflowNode: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    workflowConnection: {
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

  it('/automations (POST) - Create Automation', async () => {
    const response = await request(app.getHttpServer())
      .post('/automations')
      .send({
        workspaceRef: testWorkspaceRef,
        name: 'Saas Auto Workflow',
        description: 'Auto launch sequences',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    createdAutomationId = response.body.id;
  });

  it('/automations/:id/triggers (POST) - Add Trigger', async () => {
    await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/triggers`)
      .send({
        type: 'Cron',
        configuration: { cron: '0 9 * * *' },
      })
      .expect(201);
  });

  it('/automations/:id/triggers (DELETE) - Remove Trigger', async () => {
    await request(app.getHttpServer())
      .delete(`/automations/${createdAutomationId}/triggers`)
      .expect(200);
  });

  it('/automations/:id/conditions (POST) - Add Condition', async () => {
    await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/conditions`)
      .send({
        type: 'Filter',
        expression: 'true',
        configuration: {},
      })
      .expect(201);
  });

  it('/automations/:id/conditions/:condId (DELETE) - Remove Condition', async () => {
    await request(app.getHttpServer())
      .delete(`/automations/${createdAutomationId}/conditions/cond-1`)
      .expect(200);
  });

  it('/automations/:id/actions (POST) - Add Action', async () => {
    await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/actions`)
      .send({
        type: 'Generic',
        name: 'Publish Post',
        configuration: { channel: 'generic-pub' },
      })
      .expect(201);
  });

  it('/automations/:id/actions/:actId (DELETE) - Remove Action', async () => {
    await request(app.getHttpServer())
      .delete(`/automations/${createdAutomationId}/actions/act-1`)
      .expect(200);
  });

  it('/automations/:id/workflow (PATCH) - Update Workflow (DAG)', async () => {
    await request(app.getHttpServer())
      .patch(`/automations/${createdAutomationId}/workflow`)
      .send({
        nodes: [
          { id: 'node-trigger', name: 'Trigger Event', type: 'Trigger', config: {} },
          { id: 'node-action', name: 'Action Generic', type: 'Action', config: { capabilityType: 'publish-instagram' } },
        ],
        connections: [
          { id: 'conn-1', sourceId: 'node-trigger', targetId: 'node-action' },
        ],
      })
      .expect(200);
  });

  it('/automations/:id/plan (POST) - Generate Plan', async () => {
    // Re-mock findFirst to return nodes and connections so plan generation works
    jest.spyOn(mockPrismaService.automation, 'findFirst').mockResolvedValueOnce({
      id: createdAutomationId,
      workspaceRef: testWorkspaceRef,
      name: 'Saas Auto Workflow',
      description: 'Auto launch sequences',
      status: 'Draft',
      variables: [],
      trigger: null,
      retryConfig: null,
      timeoutConfig: null,
      executionPlan: null,
      version: 1,
      isDeleted: false,
      nodes: [
        { id: 'node-trigger', name: 'Trigger Event', type: 'Trigger', config: {} },
        { id: 'node-action', name: 'Action Generic', type: 'Action', config: { capabilityType: 'publish-instagram' } },
      ],
      connections: [
        { id: 'conn-1', sourceId: 'node-trigger', targetId: 'node-action' },
      ],
    } as any);

    const response = await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/plan`)
      .send({ strategy: 'Sequential' })
      .expect(201);

    expect(response.body).toHaveProperty('plan');
    expect(response.body.plan).toHaveProperty('steps');
    expect(response.body.plan.steps.length).toBe(1);
    expect(response.body.plan.steps[0].id).toBe('node-action');
  });

  it('/automations/:id/publish (POST) - Publish Automation', async () => {
    // Re-mock findFirst to return valid DAG so specification satisfies publish
    jest.spyOn(mockPrismaService.automation, 'findFirst').mockResolvedValueOnce({
      id: createdAutomationId,
      workspaceRef: testWorkspaceRef,
      name: 'Saas Auto Workflow',
      description: 'Auto launch sequences',
      status: 'Draft',
      variables: [],
      trigger: { type: 'Cron', configuration: { cron: '0 9 * * *' } },
      retryConfig: null,
      timeoutConfig: null,
      executionPlan: null,
      version: 1,
      isDeleted: false,
      nodes: [
        { id: 'node-trigger', name: 'Trigger Event', type: 'Trigger', config: {} },
        { id: 'node-action', name: 'Action Generic', type: 'Action', config: { capabilityType: 'publish-instagram' } },
      ],
      connections: [
        { id: 'conn-1', sourceId: 'node-trigger', targetId: 'node-action' },
      ],
    } as any);

    await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/publish`)
      .expect(200);
  });

  it('/automations/:id/pause (POST) - Pause Automation', async () => {
    jest.spyOn(mockPrismaService.automation, 'findFirst').mockResolvedValueOnce({
      id: createdAutomationId,
      workspaceRef: testWorkspaceRef,
      name: 'Saas Auto Workflow',
      description: 'Auto launch sequences',
      status: 'Published',
      variables: [],
      trigger: null,
      retryConfig: null,
      timeoutConfig: null,
      executionPlan: null,
      version: 2,
      isDeleted: false,
      nodes: [],
      connections: [],
    } as any);

    await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/pause`)
      .expect(200);
  });

  it('/automations/:id/duplicate (POST) - Duplicate Automation', async () => {
    const response = await request(app.getHttpServer())
      .post(`/automations/${createdAutomationId}/duplicate`)
      .send({ newName: 'Copied Workflow' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
  });

  it('/automations/:id (DELETE) - Archive Automation', async () => {
    // Re-mock to satisfy archive state checks
    jest.spyOn(mockPrismaService.automation, 'findFirst').mockResolvedValueOnce({
      id: createdAutomationId,
      workspaceRef: testWorkspaceRef,
      name: 'Saas Auto Workflow',
      description: 'Auto launch sequences',
      status: 'Paused',
      variables: [],
      trigger: null,
      retryConfig: null,
      timeoutConfig: null,
      executionPlan: null,
      version: 3,
      isDeleted: false,
      nodes: [],
      connections: [],
    } as any);

    await request(app.getHttpServer())
      .delete(`/automations/${createdAutomationId}`)
      .expect(200);
  });
});
