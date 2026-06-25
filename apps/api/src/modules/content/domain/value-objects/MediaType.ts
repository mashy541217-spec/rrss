import { ValueObject } from '@rrss-auto/domain';
import { MediaCategory } from '../enums/MediaCategory';

interface MediaTypeProps { value: MediaCategory; }

export class MediaType extends ValueObject<MediaTypeProps> {
  private constructor(props: MediaTypeProps) { super(props); }
  get value(): MediaCategory { return this.props.value; }
  public static create(value: MediaCategory): MediaType {
    return new MediaType({ value });
  }
}
