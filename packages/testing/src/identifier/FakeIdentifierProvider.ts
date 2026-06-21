import { IIdentifierProvider } from '@rrss-auto/domain';

export class FakeIdentifierProvider implements IIdentifierProvider {
  private customSequence: string[] = [];
  private counter: number = 0;
  private prefix: string = 'fake-id';

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
  }

  public nextId(): string {
    if (this.customSequence.length > 0) {
      const next = this.customSequence.shift();
      if (next !== undefined) {
        return next;
      }
    }
    this.counter++;
    return `${this.prefix}-${this.counter}`;
  }

  public isValid(id: string): boolean {
    return id.trim().length > 0;
  }

  public setNextId(id: string): void {
    this.customSequence = [id];
  }

  public setSequence(ids: string[]): void {
    this.customSequence = [...ids];
  }

  public reset(): void {
    this.customSequence = [];
    this.counter = 0;
  }
}
