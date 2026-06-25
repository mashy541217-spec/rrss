import { ValueObject } from '@rrss-auto/domain';

interface ThumbnailReferenceProps { assetId: string; url?: string; }

export class ThumbnailReference extends ValueObject<ThumbnailReferenceProps> {
  private constructor(props: ThumbnailReferenceProps) { super(props); }
  get assetId(): string { return this.props.assetId; }
  get url(): string | undefined { return this.props.url; }
  public static create(assetId: string, url?: string): ThumbnailReference {
    if (!assetId) throw new Error('ThumbnailReference requires an assetId');
    return new ThumbnailReference({ assetId, url });
  }
}
