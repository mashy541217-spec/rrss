import { UnitOfWork } from '../UnitOfWork';
import { TransactionScope } from '../TransactionScope';
import { PrismaService } from '../../prisma/PrismaService';

describe('UnitOfWork', () => {
  let uow: UnitOfWork;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return await callback({ isTransactionClient: true });
      })
    };
    uow = new UnitOfWork(prisma as any);
  });

  it('should execute operation and run commit hooks on success', async () => {
    const hook1 = jest.fn().mockResolvedValue(undefined);
    const hook2 = jest.fn().mockResolvedValue(undefined);

    const result = await uow.execute(async (scope: TransactionScope) => {
      scope.onCommit(hook1);
      scope.onCommit(hook2);
      return 'SUCCESS';
    });

    expect(result).toBe('SUCCESS');
    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).toHaveBeenCalledTimes(1);
  });

  it('should NOT run commit hooks if operation fails', async () => {
    const hook = jest.fn().mockResolvedValue(undefined);

    prisma.$transaction.mockImplementation(async (callback: any) => {
      return await callback({ isTransactionClient: true });
    });

    await expect(uow.execute(async (scope: TransactionScope) => {
      scope.onCommit(hook);
      throw new Error('Transaction failed');
    })).rejects.toThrow('Transaction failed');

    expect(hook).not.toHaveBeenCalled();
  });

  it('should not crash if a hook fails', async () => {
    const failingHook = jest.fn().mockRejectedValue(new Error('Hook failed'));
    const successHook = jest.fn().mockResolvedValue(undefined);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await uow.execute(async (scope: TransactionScope) => {
      scope.onCommit(failingHook);
      scope.onCommit(successHook);
      return 'SUCCESS';
    });

    expect(result).toBe('SUCCESS');
    expect(failingHook).toHaveBeenCalledTimes(1);
    expect(successHook).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Post-commit hook failed', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});
