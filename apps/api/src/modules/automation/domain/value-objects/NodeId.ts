import { ValueObject } from '@rrss-auto/domain';
interface NodeIdProps { value: string; }
export class NodeId extends ValueObject<NodeIdProps> {
  private constructor(props: NodeIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): NodeId {
    if (!value || value.trim().length === 0) throw new Error('NodeId cannot be empty');
    return new NodeId({ value });
  }
}
