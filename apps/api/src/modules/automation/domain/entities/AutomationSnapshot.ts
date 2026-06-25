import { Entity, ValueObject } from '@rrss-auto/domain';

export class SnapshotId extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  static create(value: string): SnapshotId { return new SnapshotId({ value }); }
}

interface AutomationSnapshotProps {
  automationId: string;
  snapshotData: any;
  createdAt: Date;
}

export class AutomationSnapshot extends Entity<AutomationSnapshotProps, SnapshotId> {
  private constructor(props: AutomationSnapshotProps, id: SnapshotId) {
    super(props, id);
  }

  get automationId(): string { return this.props.automationId; }
  get snapshotData(): any { return this.props.snapshotData; }
  get createdAt(): Date { return this.props.createdAt; }

  public static create(props: AutomationSnapshotProps, id: SnapshotId): AutomationSnapshot {
    return new AutomationSnapshot(props, id);
  }
}
