import { Entity, ValueObject } from '@rrss-auto/domain';
import { MediaId } from '../value-objects/MediaId';
import { AssetId } from '../value-objects/AssetId';
import { MimeType } from '../value-objects/MimeType';
import { FileSize } from '../value-objects/FileSize';
import { Checksum } from '../value-objects/Checksum';
import { Resolution } from '../value-objects/Resolution';
import { Duration } from '../value-objects/Duration';
import { AltText } from '../value-objects/AltText';

export interface MediaFileProps {
  id: MediaId;
  assetId: AssetId;
  url: string;
  bucket?: string;
  storageKey?: string;
  mimeType: MimeType;
  fileSize: FileSize;
  checksum?: Checksum;
  resolution?: Resolution;
  duration?: Duration;
  altText?: AltText;
  createdAt: Date;
}

export class MediaFile extends Entity<MediaFileProps, MediaId> {
  public get id(): MediaId { return this.props.id; }
  public get assetId(): AssetId { return this.props.assetId; }
  public get url(): string { return this.props.url; }
  public get bucket(): string | undefined { return this.props.bucket; }
  public get storageKey(): string | undefined { return this.props.storageKey; }
  public get mimeType(): MimeType { return this.props.mimeType; }
  public get fileSize(): FileSize { return this.props.fileSize; }
  public get checksum(): Checksum | undefined { return this.props.checksum; }
  public get resolution(): Resolution | undefined { return this.props.resolution; }
  public get duration(): Duration | undefined { return this.props.duration; }
  public get altText(): AltText | undefined { return this.props.altText; }
  public get createdAt(): Date { return this.props.createdAt; }

  private constructor(props: MediaFileProps) {
    super(props, props.id);
  }

  public static create(props: MediaFileProps): MediaFile {
    return new MediaFile(props);
  }
}
