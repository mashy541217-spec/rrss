import { ValueObject } from '@rrss-auto/domain';

interface WorkerVersionProps {
  version: string;
}

export class WorkerVersion extends ValueObject<WorkerVersionProps> {
  private constructor(props: WorkerVersionProps) {
    super(props);
  }

  get version(): string { return this.props.version; }

  public static create(version: string): WorkerVersion {
    if (!version || version.trim().length === 0) throw new Error('WorkerVersion cannot be empty');
    return new WorkerVersion({ version });
  }
}
