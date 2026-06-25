import { OutboxRelayService } from '../outbox/OutboxRelayService';

describe('OutboxRelayService', () => {
  let relayService: OutboxRelayService;
  let prisma: any;
  let eventBus: any;
  let retryEngine: any;

  beforeEach(() => {
    prisma = {
      outboxMessage: {
        findMany: jest.fn(),
        update: jest.fn(),
      }
    };
    eventBus = {
      publish: jest.fn(),
    };
    retryEngine = {
      handleFailure: jest.fn(),
    };

    relayService = new OutboxRelayService(prisma, eventBus, retryEngine);
  });

  afterEach(() => {
    relayService.onModuleDestroy();
  });

  it('should process pending messages successfully', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        eventType: 'TestEvent',
        payload: '{"some":"data"}',
        status: 'PENDING'
      }
    ];

    prisma.outboxMessage.findMany.mockResolvedValue(mockMessages);
    eventBus.publish.mockResolvedValue(undefined);

    await relayService.wakeUp();

    expect(prisma.outboxMessage.findMany).toHaveBeenCalled();
    
    expect(eventBus.publish).toHaveBeenCalledWith({
      some: 'data',
      eventType: 'TestEvent'
    });

    expect(prisma.outboxMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg-1' },
      data: {
        status: 'PROCESSED',
        processedAt: expect.any(Date),
        error: null
      }
    });
  });

  it('should delegate to retry engine if publishing fails', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        eventType: 'TestEvent',
        payload: '{"some":"data"}',
        status: 'PENDING'
      }
    ];

    prisma.outboxMessage.findMany.mockResolvedValue(mockMessages);
    
    const error = new Error('Bus failure');
    eventBus.publish.mockRejectedValue(error);

    await relayService.wakeUp();

    expect(eventBus.publish).toHaveBeenCalled();
    expect(retryEngine.handleFailure).toHaveBeenCalledWith('msg-1', error);
    expect(prisma.outboxMessage.update).not.toHaveBeenCalled(); // Handled by retry engine
  });
});
