import { RetryEngine } from '../outbox/RetryEngine';

describe('RetryEngine', () => {
  let retryEngine: RetryEngine;
  let prisma: any;
  let dlq: any;

  beforeEach(() => {
    prisma = {
      outboxMessage: {
        findUnique: jest.fn(),
        update: jest.fn(),
      }
    };
    dlq = {
      moveToDeadLetter: jest.fn(),
    };

    retryEngine = new RetryEngine(prisma, dlq);
  });

  it('should increment retry count and mark as FAILED if under max retries', async () => {
    prisma.outboxMessage.findUnique.mockResolvedValue({
      id: 'msg-1',
      retries: 1
    });

    await retryEngine.handleFailure('msg-1', new Error('Something went wrong'));

    expect(prisma.outboxMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg-1' },
      data: {
        status: 'FAILED',
        retries: 2,
        error: 'Something went wrong'
      }
    });
    expect(dlq.moveToDeadLetter).not.toHaveBeenCalled();
  });

  it('should move to DLQ if max retries reached', async () => {
    prisma.outboxMessage.findUnique.mockResolvedValue({
      id: 'msg-1',
      retries: 2 // Max is 3, so new retries will be 3
    });

    await retryEngine.handleFailure('msg-1', new Error('Something went wrong again'));

    expect(dlq.moveToDeadLetter).toHaveBeenCalledWith('msg-1', 'Something went wrong again');
    expect(prisma.outboxMessage.update).not.toHaveBeenCalled();
  });
});
