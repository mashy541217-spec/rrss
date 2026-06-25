import { ValueObject } from '@rrss-auto/domain';

interface TranscriptReferenceProps { assetId: string; languageCode: string; url?: string; }

export class TranscriptReference extends ValueObject<TranscriptReferenceProps> {
  private constructor(props: TranscriptReferenceProps) { super(props); }
  get assetId(): string { return this.props.assetId; }
  get languageCode(): string { return this.props.languageCode; }
  get url(): string | undefined { return this.props.url; }
  public static create(assetId: string, languageCode: string, url?: string): TranscriptReference {
    if (!assetId || !languageCode) throw new Error('TranscriptReference requires assetId and languageCode');
    return new TranscriptReference({ assetId, languageCode, url });
  }
}
