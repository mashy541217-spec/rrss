import { Injectable } from '@nestjs/common';
import { TransactionScope } from '../uow/TransactionScope';

/**
 * Optional Factory for instantiating repositories with a specific transaction scope.
 * While not strictly required if repositories use method-level scope injection,
 * this supports the pattern where a repository wraps the scope per-instance.
 */
@Injectable()
export class RepositoryFactory {
  create<T>(RepositoryClass: new (scope: TransactionScope, ...args: any[]) => T, scope: TransactionScope, ...dependencies: any[]): T {
    return new RepositoryClass(scope, ...dependencies);
  }
}
