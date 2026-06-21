import { IUnitOfWork } from '@rrss-auto/application';

export abstract class BaseUnitOfWork implements IUnitOfWork {
  public abstract commit(): Promise<void>;
  public abstract rollback(): Promise<void>;
}
