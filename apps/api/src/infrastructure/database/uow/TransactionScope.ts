/**
 * Represents the scope of an atomic transaction.
 * In Prisma, this wraps the Prisma.TransactionClient object.
 * By keeping this generic, the Application Layer does not depend directly on Prisma.
 */
export class TransactionScope {
  private readonly postCommitHooks: Array<() => Promise<void>> = [];

  constructor(public readonly client: any) {}

  onCommit(hook: () => Promise<void>): void {
    this.postCommitHooks.push(hook);
  }

  getHooks(): Array<() => Promise<void>> {
    return this.postCommitHooks;
  }
}
