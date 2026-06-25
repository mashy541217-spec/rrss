import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { Content } from '../../../domain/aggregate/Content';
import { ContentId } from '../../../domain/value-objects/ContentId';
import { ContentStatus } from '../../../domain/enums/ContentStatus';
import { ContentMetadata } from '../../../domain/entities/ContentMetadata';
import { Caption } from '../../../domain/value-objects/Caption';
import { SeoTitle } from '../../../domain/value-objects/SeoTitle';
import { SeoDescription } from '../../../domain/value-objects/SeoDescription';

@Injectable()
export class PrismaContentRepository implements IContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(content: Content): Promise<void> {
    const metaPayload = {
      caption: content.metadata.caption.value,
      hashtags: content.metadata.hashtags.map(h => h.value),
      seoTitle: content.metadata.seoTitle.value,
      seoDescription: content.metadata.seoDescription.value,
      tags: content.metadata.tags,
      customFields: content.metadata.customFields,
      thumbnailAssetId: content.metadata.thumbnail?.assetId ?? null,
    };

    await this.prisma.content.upsert({
      where: { id: content.id.value },
      update: {
        status: content.status,
        title: content.title,
        body: content.body,
        metadata: metaPayload as any,
        version: content.version,
        isDeleted: content.isDeleted,
        deletedAt: content.deletedAt ?? null,
        updatedAt: content.updatedAt,
      },
      create: {
        id: content.id.value,
        workspaceRef: content.workspaceRef,
        status: content.status,
        title: content.title,
        body: content.body,
        metadata: metaPayload as any,
        version: content.version,
        isDeleted: content.isDeleted,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      },
    });
  }

  public async findById(id: ContentId): Promise<Content | null> {
    const raw = await this.prisma.content.findUnique({
      where: { id: id.value },
    });

    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findByWorkspace(workspaceRef: string): Promise<Content[]> {
    const raws = await this.prisma.content.findMany({
      where: { workspaceRef, isDeleted: false },
    });
    return raws.map(r => this.toDomain(r));
  }

  public async delete(id: ContentId): Promise<void> {
    await this.prisma.content.delete({ where: { id: id.value } });
  }

  private toDomain(raw: any): Content {
    const meta = (raw.metadata as any) ?? {};

    const metadata = ContentMetadata.create({
      id: raw.id,
      caption: Caption.create(meta.caption ?? ''),
      hashtags: (meta.hashtags ?? []).map((h: string) => ({ value: h }) as any),
      seoTitle: SeoTitle.create(meta.seoTitle ?? ''),
      seoDescription: SeoDescription.create(meta.seoDescription ?? ''),
      tags: meta.tags ?? [],
      customFields: meta.customFields ?? {},
    });

    return Content.reconstitute({
      id: ContentId.create(raw.id),
      workspaceRef: raw.workspaceRef,
      createdBy: raw.createdBy ?? 'system',
      status: raw.status as ContentStatus,
      title: raw.title ?? undefined,
      body: raw.body ?? undefined,
      version: raw.version,
      metadata,
      localizations: [],
      analyticsSnapshots: [],
      isDeleted: raw.isDeleted,
      deletedAt: raw.deletedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
