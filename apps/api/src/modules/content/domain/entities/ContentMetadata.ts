import { Entity } from '@rrss-auto/domain';
import { Caption } from '../value-objects/Caption';
import { Hashtag } from '../value-objects/Hashtag';
import { SeoTitle } from '../value-objects/SeoTitle';
import { SeoDescription } from '../value-objects/SeoDescription';
import { ThumbnailReference } from '../value-objects/ThumbnailReference';

export interface ContentMetadataProps {
  id: string;
  caption: Caption;
  hashtags: Hashtag[];
  seoTitle: SeoTitle;
  seoDescription: SeoDescription;
  thumbnail?: ThumbnailReference;
  tags: string[];
  customFields: Record<string, unknown>;
}

export class ContentMetadata extends Entity<ContentMetadataProps, any> {
  public get id(): string { return this.props.id; }
  public get caption(): Caption { return this.props.caption; }
  public get hashtags(): Hashtag[] { return [...this.props.hashtags]; }
  public get seoTitle(): SeoTitle { return this.props.seoTitle; }
  public get seoDescription(): SeoDescription { return this.props.seoDescription; }
  public get thumbnail(): ThumbnailReference | undefined { return this.props.thumbnail; }
  public get tags(): string[] { return [...this.props.tags]; }
  public get customFields(): Record<string, unknown> { return { ...this.props.customFields }; }

  private constructor(props: ContentMetadataProps) {
    super(props, props.id as any);
  }

  public static create(props: ContentMetadataProps): ContentMetadata {
    return new ContentMetadata(props);
  }

  public static empty(id: string): ContentMetadata {
    return ContentMetadata.create({
      id,
      caption: Caption.empty(),
      hashtags: [],
      seoTitle: SeoTitle.empty(),
      seoDescription: SeoDescription.empty(),
      tags: [],
      customFields: {},
    });
  }
}
