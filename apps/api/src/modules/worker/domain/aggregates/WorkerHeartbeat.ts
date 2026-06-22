import { Entity, ValueObject } from '@rrss-auto/domain';
import { WorkerHealth } from '../enums/WorkerHealth';

export interface WorkerHeartbeatProps {
  timestamp: Date;
  reportedHealth: WorkerHealth;
  currentLoad: number; // 0 to 1
  uptimeSeconds: number;
}

export class WorkerHeartbeat extends Entity<WorkerHeartbeatProps, ValueObject<any>> {
  private constructor(props: WorkerHeartbeatProps, id: ValueObject<any>) {
    super(props, id);
  }

  get timestamp(): Date { return this.props.timestamp; }
  get reportedHealth(): WorkerHealth { return this.props.reportedHealth; }
  get currentLoad(): number { return this.props.currentLoad; }

  public static create(reportedHealth: WorkerHealth, currentLoad: number, uptimeSeconds: number): WorkerHeartbeat {
    return new WorkerHeartbeat({
      timestamp: new Date(),
      reportedHealth,
      currentLoad,
      uptimeSeconds
    }, { value: Date.now() } as any);
  }
}
