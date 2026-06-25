import { Entity } from '@rrss-auto/domain';
import { AudienceSegment } from '../value-objects/AudienceSegment';

export interface AudienceProps {
  name: string;
  segments: AudienceSegment[];
  rules: Record<string, unknown>;
}

export class Audience extends Entity<AudienceProps, any> {
  private constructor(props: AudienceProps, id: string) { super(props, id); }
  get name(): string { return this.props.name; }
  get segments(): AudienceSegment[] { return [...this.props.segments]; }
  get rules(): Record<string, unknown> { return this.props.rules; }

  public static create(props: AudienceProps, id: string): Audience {
    return new Audience(props, id);
  }
}