import { IDomainEvent, ValueObject } from '@rrss-auto/domain';

class StringVO extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  static of(value: string): StringVO { return new StringVO({ value }); }
}

export class ContentCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly contentId: string,
    public readonly workspaceRef: string,
    public readonly createdBy: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.contentId); }
}

export class ContentUpdated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly contentId: string, public readonly updatedBy: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.contentId); }
}

export class ContentArchived implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly contentId: string, public readonly archivedBy: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.contentId); }
}

export class ContentVersionCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly contentId: string,
    public readonly version: number,
    public readonly createdBy: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.contentId); }
}

export class LocalizationAdded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly contentId: string,
    public readonly languageCode: string,
    public readonly addedBy: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.contentId); }
}

export class MediaUploaded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly assetId: string,
    public readonly workspaceRef: string,
    public readonly mediaType: string,
    public readonly fileSizeBytes: bigint,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.assetId); }
}

export class MediaRemoved implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly assetId: string, public readonly removedBy: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.assetId); }
}

export class PublicationProfileCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly profileId: string,
    public readonly workspaceRef: string,
    public readonly createdBy: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.profileId); }
}
