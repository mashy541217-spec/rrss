import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/PrismaService';
import { TransactionScope } from './TransactionScope';

export interface IUnitOfWork {
  execute<T>(operation: (scope: TransactionScope) => Promise<T>): Promise<T>;
}

@Injectable()
export class UnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes a series of repository operations within a single database transaction.
   * If any operation throws an error, the entire transaction is rolled back.
   * 
   * @param operation The callback containing the operations to run inside the transaction.
   * @returns The result of the operation.
   */
  async execute<T>(operation: (scope: TransactionScope) => Promise<T>): Promise<T> {
    let scope: TransactionScope;
    
    const result = await this.prisma.$transaction(async (tx) => {
      scope = new TransactionScope(tx);
      return await operation(scope);
    });

    // Execute hooks ONLY if the transaction was successful
    for (const hook of scope!.getHooks()) {
      try {
        await hook();
      } catch (err) {
        // We log hook failures but do not crash the app, as the transaction already committed
        console.error('Post-commit hook failed', err);
      }
    }

    return result;
  }
}
