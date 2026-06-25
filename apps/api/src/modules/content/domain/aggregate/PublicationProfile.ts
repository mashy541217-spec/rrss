import { AggregateRoot } from '@rrss-auto/domain';
import { PublicationTarget } from '../entities/PublicationTarget';
import { PublicationFormat } from '../value-objects/PublicationFormat';
import { PublicationStatus } from '../enums/PublicationStatus';
import { PublicationProfileCreated } from '../events/ContentEvents';

export interface PublicationProfileSettings {
  defaultFormat?: string;
  schedulePolicy?: Record<string, unknown>;
  platformSettings: Record<string, unknown>;
}

export interface PublicationProfileProps {
  id: string;
  workspaceRef: string;
  name: string;
  targets: PublicationTarget[];
  settings: PublicationProfileSettings;
  createdBy: string;
  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class PublicationProfile extends AggregateRoot<PublicationProfileProps, any> {
  public get id(): string { return this.props.id; }
  public get workspaceRef(): string { return this.props.workspaceRef; }
  public get name(): string { return this.props.name; }
  public get targets(): PublicationTarget[] { return [...this.props.targets]; }
  public get settings(): PublicationProfileSettings { return { ...this.props.settings }; }
  public get createdBy(): string { return this.props.createdBy; }
  public get version(): number { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  private constructor(props: PublicationProfileProps) {
    super(props, props.id as any);
  }

  public static create(props: {
    id: string;
    workspaceRef: string;
    name: string;
    createdBy: string;
    settings?: PublicationProfileSettings;
  }): PublicationProfile {
    const now = new Date();
    const profile = new PublicationProfile({
      ...props,
      targets: [],
      settings: props.settings ?? { platformSettings: {} },
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    profile.addDomainEvent(new PublicationProfileCreated(
      profile.id,
      profile.workspaceRef,
      profile.createdBy,
    ));

    return profile;
  }

  public static reconstitute(props: PublicationProfileProps): PublicationProfile {
    return new PublicationProfile(props);
  }

  public addTarget(
    id: string,
    platformType: string,
    format: PublicationFormat,
    scheduledAt?: Date,
  ): void {
    const existing = this.props.targets.find(t => t.platformType === platformType);
    if (existing) throw new Error(`Target for platform ${platformType} already exists`);

    const target = PublicationTarget.create({
      id,
      profileId: this.props.id,
      platformType,
      format,
      status: scheduledAt ? PublicationStatus.SCHEDULED : PublicationStatus.PENDING,
      scheduledAt,
    });

    this.props.targets.push(target);
    this.props.updatedAt = new Date();
    this.props.version += 1;
  }

  public getTarget(platformType: string): PublicationTarget | undefined {
    return this.props.targets.find(t => t.platformType === platformType);
  }

  public softDelete(): void {
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
  }
}
