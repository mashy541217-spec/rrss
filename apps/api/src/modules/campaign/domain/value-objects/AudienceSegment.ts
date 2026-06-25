import { ValueObject } from '@rrss-auto/domain';
interface AudienceSegmentProps { value: string; }
export class AudienceSegment extends ValueObject<AudienceSegmentProps> {
  private constructor(props: AudienceSegmentProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): AudienceSegment {
    if (!value || value.trim().length === 0) throw new Error('AudienceSegment cannot be empty');
    return new AudienceSegment({ value });
  }
}