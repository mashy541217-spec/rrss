import { AggregateRoot } from '@rrss-auto/domain';

export interface ContentTemplateField {
  key: string;
  type: 'text' | 'image' | 'video' | 'hashtags' | 'url' | 'boolean' | 'number';
  label: string;
  required: boolean;
  defaultValue?: unknown;
  validationRules?: Record<string, unknown>;
}

export interface ContentTemplateProps {
  id: string;
  workspaceRef: string;
  name: string;
  description?: string;
  fields: ContentTemplateField[];
  defaultMetadata: Record<string, unknown>;
  supportedPlatforms: string[]; // Platform adapter keys, e.g. ["INSTAGRAM", "TIKTOK"]
  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ContentTemplate extends AggregateRoot<ContentTemplateProps, any> {
  public get id(): string { return this.props.id; }
  public get workspaceRef(): string { return this.props.workspaceRef; }
  public get name(): string { return this.props.name; }
  public get description(): string | undefined { return this.props.description; }
  public get fields(): ContentTemplateField[] { return [...this.props.fields]; }
  public get defaultMetadata(): Record<string, unknown> { return { ...this.props.defaultMetadata }; }
  public get supportedPlatforms(): string[] { return [...this.props.supportedPlatforms]; }
  public get version(): number { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  private constructor(props: ContentTemplateProps) {
    super(props, props.id as any);
  }

  public static create(props: {
    id: string;
    workspaceRef: string;
    name: string;
    description?: string;
    fields?: ContentTemplateField[];
    defaultMetadata?: Record<string, unknown>;
    supportedPlatforms?: string[];
  }): ContentTemplate {
    const now = new Date();
    return new ContentTemplate({
      ...props,
      fields: props.fields ?? [],
      defaultMetadata: props.defaultMetadata ?? {},
      supportedPlatforms: props.supportedPlatforms ?? [],
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(props: ContentTemplateProps): ContentTemplate {
    return new ContentTemplate(props);
  }

  public addField(field: ContentTemplateField): void {
    const exists = this.props.fields.find(f => f.key === field.key);
    if (exists) throw new Error(`Field '${field.key}' already exists`);
    this.props.fields.push(field);
    this.props.version += 1;
    this.props.updatedAt = new Date();
  }

  public supportsField(key: string): boolean {
    return this.props.fields.some(f => f.key === key);
  }

  public supportsPlatform(platformKey: string): boolean {
    return this.props.supportedPlatforms.length === 0 ||
      this.props.supportedPlatforms.includes(platformKey);
  }

  public softDelete(): void {
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
  }
}
