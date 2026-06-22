import { ValueObject } from '@rrss-auto/domain';

interface WorkerEndpointProps {
  url: string;
}

export class WorkerEndpoint extends ValueObject<WorkerEndpointProps> {
  private constructor(props: WorkerEndpointProps) {
    super(props);
  }

  get url(): string { return this.props.url; }

  public static create(url: string): WorkerEndpoint {
    if (!url || !url.startsWith('http')) throw new Error('Invalid endpoint URL');
    return new WorkerEndpoint({ url });
  }
}
