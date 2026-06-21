import { Worker, WorkerProps } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Worker';
import { WorkerId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/WorkerId';
import { WorkerCapability } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/WorkerCapability';
import { WorkerStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/WorkerStatus';
import { CapabilityType } from '../../../../../../apps/api/src/modules/execution/domain/enums/CapabilityType';

export class WorkerBuilder {
  private props: Partial<WorkerProps> = {};
  private id: string = 'worker-123';

  public static create(): WorkerBuilder {
    return new WorkerBuilder();
  }

  public withId(id: string): this { this.id = id; return this; }
  public withStatus(status: WorkerStatus): this { this.props.status = status; return this; }
  public withHostname(hostname: string): this { this.props.hostname = hostname; return this; }
  public withCapabilities(caps: WorkerCapability[]): this { this.props.capabilities = caps; return this; }
  public withCurrentJobId(jobId: string): this { this.props.currentJobId = jobId; return this; }
  public withActiveJobCount(count: number): this { this.props.activeJobCount = count; return this; }

  public build(): Worker {
    return Worker.initialize({
      hostname: this.props.hostname ?? 'test-host',
      status: this.props.status ?? WorkerStatus.Idle,
      capabilities: this.props.capabilities ?? [WorkerCapability.create(CapabilityType.Generic)],
      heartbeat: this.props.heartbeat,
      currentJobId: this.props.currentJobId,
      registeredAt: this.props.registeredAt ?? new Date(),
      concurrencyLimit: this.props.concurrencyLimit ?? 1,
      activeJobCount: this.props.activeJobCount ?? 0,
    }, WorkerId.create(this.id));
  }
}
