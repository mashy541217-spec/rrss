import { ValueObject } from '@rrss-auto/domain';

interface ResourceIdProps {
  value: string;
}

export class ResourceId extends ValueObject<ResourceIdProps> {
  private constructor(props: ResourceIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(id: string): ResourceId {
    if (!id || id.trim().length === 0) {
      throw new Error('ResourceId cannot be empty');
    }
    return new ResourceId({ value: id });
  }
}
