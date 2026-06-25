import { AggregateRoot } from '@rrss-auto/domain';
import { ContentId } from '../value-objects/ContentId';
import { ContentVersionCreated } from '../events/ContentEvents';

export interface ContentVersionSnapshot {
  title?: string;
  body?: string;
  metadata: Record<string, unknown>;
}

export interface ContentVersionProps {
  id: string;
  contentId: ContentId;
  versionNumber: number;
  snapshot: ContentVersionSnapshot;
  createdBy: string;
  createdAt: Date;
}

export class ContentVersion extends AggregateRoot<ContentVersionProps, any> {
  public get id(): string { return this.props.id; }
  public get contentId(): ContentId { return this.props.contentId; }
  public get versionNumber(): number { return this.props.versionNumber; }
  public get snapshot(): ContentVersionSnapshot { return { ...this.props.snapshot }; }
  public get createdBy(): string { return this.props.createdBy; }
  public get createdAt(): Date { return this.props.createdAt; }

  private constructor(props: ContentVersionProps) {
    super(props, props.id as any);
  }

  public static create(props: {
    id: string;
    contentId: ContentId;
    versionNumber: number;
    snapshot: ContentVersionSnapshot;
    createdBy: string;
  }): ContentVersion {
    const version = new ContentVersion({
      ...props,
      createdAt: new Date(),
    });

    version.addDomainEvent(new ContentVersionCreated(
      props.contentId.value,
      props.versionNumber,
      props.createdBy,
    ));

    return version;
  }

  public static reconstitute(props: ContentVersionProps): ContentVersion {
    return new ContentVersion(props);
  }
}
