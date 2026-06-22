import { Worker, WorkerId, WorkerType, WorkerEndpoint, WorkerCapacity } from '../../../../../../apps/api/src/modules/worker/domain';

export class WorkerBuilder {
  private id: string = 'worker-1';
  private type: WorkerType = WorkerType.VM;
  private endpoint: string = 'http://10.0.0.1:8080';
  private capacity: number = 2;

  public static create(): WorkerBuilder {
    return new WorkerBuilder();
  }

  public withId(id: string): WorkerBuilder {
    this.id = id;
    return this;
  }

  public withType(type: WorkerType): WorkerBuilder {
    this.type = type;
    return this;
  }

  public withCapacity(capacity: number): WorkerBuilder {
    this.capacity = capacity;
    return this;
  }

  public build(): Worker {
    return Worker.register(
      WorkerId.create(this.id),
      this.type,
      WorkerEndpoint.create(this.endpoint),
      WorkerCapacity.create(this.capacity)
    );
  }
}
