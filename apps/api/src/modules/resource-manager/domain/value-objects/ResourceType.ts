import { ValueObject } from '@rrss-auto/domain';

interface ResourceTypeProps {
  type: string;
}

export class ResourceType extends ValueObject<ResourceTypeProps> {
  public static readonly Worker = new ResourceType({ type: 'worker' });
  public static readonly VM = new ResourceType({ type: 'vm' });
  public static readonly Browser = new ResourceType({ type: 'browser' });
  public static readonly AndroidDevice = new ResourceType({ type: 'android_device' });
  public static readonly Proxy = new ResourceType({ type: 'proxy' });

  private constructor(props: ResourceTypeProps) {
    super(props);
  }

  get type(): string {
    return this.props.type;
  }

  public static create(type: string): ResourceType {
    if (!type || type.trim().length === 0) throw new Error('ResourceType cannot be empty');
    return new ResourceType({ type: type.toLowerCase() });
  }
}
