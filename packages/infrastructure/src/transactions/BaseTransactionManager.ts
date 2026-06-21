import { ITransactionManager, IUnitOfWork } from '@rrss-auto/application';

export abstract class BaseTransactionManager implements ITransactionManager {
  public abstract startTransaction(): Promise<IUnitOfWork>;
  
  public async runInTransaction<T>(operation: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    const uow = await this.startTransaction();
    try {
      const result = await operation(uow);
      await uow.commit();
      return result;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }
}
