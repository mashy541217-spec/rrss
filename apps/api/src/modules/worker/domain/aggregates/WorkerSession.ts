import { Entity, ValueObject } from '@rrss-auto/domain';

export interface WorkerSessionProps {
  sessionId: string;
  connectedAt: Date;
  disconnectedAt: Date | null;
  disconnectReason: string | null;
}

export class WorkerSession extends Entity<WorkerSessionProps, ValueObject<any>> {
  private constructor(props: WorkerSessionProps, id: ValueObject<any>) {
    super(props, id);
  }

  get sessionId(): string { return this.props.sessionId; }
  get connectedAt(): Date { return this.props.connectedAt; }
  get disconnectedAt(): Date | null { return this.props.disconnectedAt; }
  get isActive(): boolean { return this.props.disconnectedAt === null; }

  public static create(sessionId: string): WorkerSession {
    return new WorkerSession({
      sessionId,
      connectedAt: new Date(),
      disconnectedAt: null,
      disconnectReason: null
    }, { value: sessionId } as any);
  }

  public terminate(reason: string): void {
    if (!this.isActive) return;
    this.props.disconnectedAt = new Date();
    this.props.disconnectReason = reason;
  }
}
