import { Worker, WorkerProps } from '../aggregates/Worker';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerCapability } from '../value-objects/WorkerCapability';
import { CapabilityType } from '../enums/CapabilityType';

export interface RegisterWorkerInput {
  rawId: string;
  hostname: string;
  capabilities?: Array<{ type: CapabilityType; version?: string }>;
  concurrencyLimit?: number;
  heartbeatIntervalMs?: number;
}

export class WorkerFactory {
  public static register(input: RegisterWorkerInput): Worker {
    const id = WorkerId.create(input.rawId);
    const capabilities = (input.capabilities ?? []).map((c) =>
      WorkerCapability.create(c.type, c.version)
    );
    return Worker.register(
      {
        hostname: input.hostname,
        capabilities,
        heartbeat: undefined,
        currentJobId: undefined,
        concurrencyLimit: input.concurrencyLimit ?? 1,
      },
      id,
    );
  }

  public static reconstitute(props: WorkerProps, id: WorkerId): Worker {
    return Worker.initialize(props, id);
  }
}
