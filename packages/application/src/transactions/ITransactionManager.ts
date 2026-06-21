import { IUnitOfWork } from './IUnitOfWork';

export interface ITransactionManager {
  startTransaction(): Promise<IUnitOfWork>;
  runInTransaction<T>(operation: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
