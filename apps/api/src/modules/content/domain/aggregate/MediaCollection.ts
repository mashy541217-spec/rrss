import { AggregateRoot } from '@rrss-auto/domain';
import { ContentId } from '../value-objects/ContentId';
import { AssetId } from '../value-objects/AssetId';

export interface MediaCollectionItem {
  assetId: string;
  order: number;
  label?: string;
}

export interface MediaCollectionProps {
  id: string;
  contentId: ContentId;
  name: string;
  type: string; // e.g. "GALLERY", "CAROUSEL", "STORY_SEQUENCE"
  items: MediaCollectionItem[];
  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class MediaCollection extends AggregateRoot<MediaCollectionProps, any> {
  public get id(): string { return this.props.id; }
  public get contentId(): ContentId { return this.props.contentId; }
  public get name(): string { return this.props.name; }
  public get type(): string { return this.props.type; }
  public get items(): MediaCollectionItem[] { return [...this.props.items]; }
  public get version(): number { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  private constructor(props: MediaCollectionProps) {
    super(props, props.id as any);
  }

  public static create(props: {
    id: string;
    contentId: ContentId;
    name: string;
    type: string;
  }): MediaCollection {
    const now = new Date();
    return new MediaCollection({
      ...props,
      items: [],
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(props: MediaCollectionProps): MediaCollection {
    return new MediaCollection(props);
  }

  public addItem(assetId: AssetId, label?: string): void {
    const nextOrder = this.props.items.length + 1;
    this.props.items.push({ assetId: assetId.value, order: nextOrder, label });
    this.props.updatedAt = new Date();
    this.props.version += 1;
  }

  public removeItem(assetId: AssetId): void {
    this.props.items = this.props.items
      .filter(i => i.assetId !== assetId.value)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    this.props.updatedAt = new Date();
    this.props.version += 1;
  }

  public reorder(orderedAssetIds: string[]): void {
    const itemMap = new Map(this.props.items.map(i => [i.assetId, i]));
    this.props.items = orderedAssetIds.map((id, idx) => {
      const existing = itemMap.get(id);
      if (!existing) throw new Error(`Asset ${id} not in collection`);
      return { ...existing, order: idx + 1 };
    });
    this.props.updatedAt = new Date();
  }
}
