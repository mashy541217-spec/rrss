import { IIdentifierProvider } from '@rrss-auto/domain';

export abstract class BaseIdentifierProvider implements IIdentifierProvider {
  public abstract nextId(): string;
  public abstract isValid(id: string): boolean;
}
