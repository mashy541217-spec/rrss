import { Entity } from '@rrss-auto/domain';
import { LanguageCode } from '../value-objects/LanguageCode';
import { Caption } from '../value-objects/Caption';
import { LocalizationStatus } from '../enums/LocalizationStatus';

export interface ContentLocalizationProps {
  id: string;
  contentId: string;
  languageCode: LanguageCode;
  caption: Caption;
  title?: string;
  body?: string;
  status: LocalizationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ContentLocalization extends Entity<ContentLocalizationProps, any> {
  public get id(): string { return this.props.id; }
  public get contentId(): string { return this.props.contentId; }
  public get languageCode(): LanguageCode { return this.props.languageCode; }
  public get caption(): Caption { return this.props.caption; }
  public get title(): string | undefined { return this.props.title; }
  public get body(): string | undefined { return this.props.body; }
  public get status(): LocalizationStatus { return this.props.status; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get isComplete(): boolean { return this.props.status === LocalizationStatus.COMPLETED; }

  private constructor(props: ContentLocalizationProps) {
    super(props, props.id as any);
  }

  public static create(props: ContentLocalizationProps): ContentLocalization {
    return new ContentLocalization(props);
  }

  public markComplete(): void {
    this.props.status = LocalizationStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  public markNeedsReview(): void {
    this.props.status = LocalizationStatus.NEEDS_REVIEW;
    this.props.updatedAt = new Date();
  }
}
