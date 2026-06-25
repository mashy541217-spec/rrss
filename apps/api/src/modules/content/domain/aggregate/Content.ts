import { AggregateRoot } from '@rrss-auto/domain';
import { ContentId } from '../value-objects/ContentId';
import { ContentStatus } from '../enums/ContentStatus';
import { ContentMetadata } from '../entities/ContentMetadata';
import { ContentLocalization } from '../entities/ContentLocalization';
import { ContentAnalyticsSnapshot } from '../entities/ContentAnalyticsSnapshot';
import { LanguageCode } from '../value-objects/LanguageCode';
import { Caption } from '../value-objects/Caption';
import { LocalizationStatus } from '../enums/LocalizationStatus';
import {
  ContentCreated,
  ContentUpdated,
  ContentArchived,
  LocalizationAdded,
  ContentVersionCreated,
} from '../events/ContentEvents';

export interface ContentProps {
  id: ContentId;
  workspaceRef: string;
  createdBy: string;
  status: ContentStatus;
  title?: string;
  body?: string;
  templateId?: string;
  version: number;
  metadata: ContentMetadata;
  localizations: ContentLocalization[];
  analyticsSnapshots: ContentAnalyticsSnapshot[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Content extends AggregateRoot<ContentProps, ContentId> {
  public get id(): ContentId { return this.props.id; }
  public get workspaceRef(): string { return this.props.workspaceRef; }
  public get createdBy(): string { return this.props.createdBy; }
  public get status(): ContentStatus { return this.props.status; }
  public get title(): string | undefined { return this.props.title; }
  public get body(): string | undefined { return this.props.body; }
  public get templateId(): string | undefined { return this.props.templateId; }
  public get version(): number { return this.props.version; }
  public get metadata(): ContentMetadata { return this.props.metadata; }
  public get localizations(): ContentLocalization[] { return [...this.props.localizations]; }
  public get analyticsSnapshots(): ContentAnalyticsSnapshot[] { return [...this.props.analyticsSnapshots]; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get deletedAt(): Date | undefined { return this.props.deletedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get isDraft(): boolean { return this.props.status === ContentStatus.DRAFT; }
  public get isPublished(): boolean { return this.props.status === ContentStatus.PUBLISHED; }
  public get isArchived(): boolean { return this.props.status === ContentStatus.ARCHIVED; }

  private constructor(props: ContentProps) {
    super(props, props.id);
  }

  public static create(props: {
    id: ContentId;
    workspaceRef: string;
    createdBy: string;
    title?: string;
    body?: string;
    templateId?: string;
  }): Content {
    const now = new Date();
    const content = new Content({
      ...props,
      status: ContentStatus.DRAFT,
      version: 1,
      metadata: ContentMetadata.empty(props.id.value),
      localizations: [],
      analyticsSnapshots: [],
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    content.addDomainEvent(new ContentCreated(
      content.id.value,
      content.workspaceRef,
      content.createdBy,
    ));

    return content;
  }

  public static reconstitute(props: ContentProps): Content {
    return new Content(props);
  }

  public updateBody(title: string | undefined, body: string | undefined, updatedBy: string): void {
    this.props.title = title;
    this.props.body = body;
    this.props.updatedAt = new Date();
    this.props.version += 1;
    this.addDomainEvent(new ContentUpdated(this.id.value, updatedBy));
    this.addDomainEvent(new ContentVersionCreated(this.id.value, this.props.version, updatedBy));
  }

  public updateMetadata(metadata: ContentMetadata): void {
    this.props.metadata = metadata;
    this.props.updatedAt = new Date();
  }

  public addLocalization(
    id: string,
    languageCode: LanguageCode,
    caption: Caption,
    addedBy: string,
    title?: string,
    body?: string,
  ): void {
    const existing = this.props.localizations.find(l => l.languageCode.equals(languageCode));
    if (existing) throw new Error(`Localization for ${languageCode.value} already exists`);

    const localization = ContentLocalization.create({
      id,
      contentId: this.props.id.value,
      languageCode,
      caption,
      title,
      body,
      status: LocalizationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.props.localizations.push(localization);
    this.addDomainEvent(new LocalizationAdded(this.id.value, languageCode.value, addedBy));
  }

  public markReady(): void {
    if (this.props.status !== ContentStatus.DRAFT && this.props.status !== ContentStatus.UNDER_REVIEW) {
      throw new Error('Content can only be marked ready from DRAFT or UNDER_REVIEW');
    }
    this.props.status = ContentStatus.READY;
    this.props.updatedAt = new Date();
  }

  public markUnderReview(): void {
    if (this.props.status !== ContentStatus.DRAFT) throw new Error('Only DRAFT content can be submitted for review');
    this.props.status = ContentStatus.UNDER_REVIEW;
    this.props.updatedAt = new Date();
  }

  public publish(): void {
    if (this.props.status !== ContentStatus.READY) throw new Error('Only READY content can be published');
    this.props.status = ContentStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  public archive(archivedBy: string): void {
    if (this.props.status === ContentStatus.ARCHIVED) return;
    this.props.status = ContentStatus.ARCHIVED;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ContentArchived(this.id.value, archivedBy));
  }

  public softDelete(): void {
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
  }

  public recordSnapshot(snapshot: ContentAnalyticsSnapshot): void {
    this.props.analyticsSnapshots.push(snapshot);
  }

  public getLocalization(languageCode: LanguageCode): ContentLocalization | undefined {
    return this.props.localizations.find(l => l.languageCode.equals(languageCode));
  }
}
