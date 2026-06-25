import { AggregateRoot } from '@rrss-auto/domain';
import { AssetId } from '../value-objects/AssetId';
import { MimeType } from '../value-objects/MimeType';
import { MediaType } from '../value-objects/MediaType';
import { FileSize } from '../value-objects/FileSize';
import { Checksum } from '../value-objects/Checksum';
import { MediaFile } from '../entities/MediaFile';
import { MediaStatus } from '../enums/MediaStatus';
import { AssetVisibility } from '../enums/AssetVisibility';
import { MediaUploaded, MediaRemoved } from '../events/ContentEvents';

export interface AssetProps {
  id: AssetId;
  workspaceRef: string;
  uploadedBy: string;
  status: MediaStatus;
  mediaType: MediaType;
  mimeType: MimeType;
  fileSize: FileSize;
  checksum?: Checksum;
  visibility: AssetVisibility;
  tags: string[];
  mediaFiles: MediaFile[];
  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Asset extends AggregateRoot<AssetProps, AssetId> {
  public get id(): AssetId { return this.props.id; }
  public get workspaceRef(): string { return this.props.workspaceRef; }
  public get uploadedBy(): string { return this.props.uploadedBy; }
  public get status(): MediaStatus { return this.props.status; }
  public get mediaType(): MediaType { return this.props.mediaType; }
  public get mimeType(): MimeType { return this.props.mimeType; }
  public get fileSize(): FileSize { return this.props.fileSize; }
  public get checksum(): Checksum | undefined { return this.props.checksum; }
  public get visibility(): AssetVisibility { return this.props.visibility; }
  public get tags(): string[] { return [...this.props.tags]; }
  public get mediaFiles(): MediaFile[] { return [...this.props.mediaFiles]; }
  public get version(): number { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get deletedAt(): Date | undefined { return this.props.deletedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get isReady(): boolean { return this.props.status === MediaStatus.READY; }

  private constructor(props: AssetProps) {
    super(props, props.id);
  }

  public static create(props: {
    id: AssetId;
    workspaceRef: string;
    uploadedBy: string;
    mediaType: MediaType;
    mimeType: MimeType;
    fileSize: FileSize;
    checksum?: Checksum;
    visibility?: AssetVisibility;
    tags?: string[];
  }): Asset {
    const now = new Date();
    const asset = new Asset({
      ...props,
      status: MediaStatus.PENDING,
      visibility: props.visibility ?? AssetVisibility.WORKSPACE,
      tags: props.tags ?? [],
      mediaFiles: [],
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    asset.addDomainEvent(new MediaUploaded(
      asset.id.value,
      asset.workspaceRef,
      asset.mediaType.value.toString(),
      asset.fileSize.bytes,
    ));

    return asset;
  }

  public static reconstitute(props: AssetProps): Asset {
    return new Asset(props);
  }

  public addMediaFile(file: MediaFile): void {
    this.props.mediaFiles.push(file);
    this.props.updatedAt = new Date();
  }

  public markReady(): void {
    this.props.status = MediaStatus.READY;
    this.props.updatedAt = new Date();
  }

  public markFailed(): void {
    this.props.status = MediaStatus.FAILED;
    this.props.updatedAt = new Date();
  }

  public markProcessing(): void {
    this.props.status = MediaStatus.PROCESSING;
    this.props.updatedAt = new Date();
  }

  public setVisibility(visibility: AssetVisibility): void {
    this.props.visibility = visibility;
    this.props.updatedAt = new Date();
  }

  public softDelete(removedBy: string): void {
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
    this.addDomainEvent(new MediaRemoved(this.id.value, removedBy));
  }

  public getPrimaryFile(): MediaFile | undefined {
    return this.props.mediaFiles[0];
  }
}
