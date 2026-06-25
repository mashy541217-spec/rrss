import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { IAssetRepository } from '../../../domain/repositories/IAssetRepository';
import { Asset } from '../../../domain/aggregate/Asset';
import { AssetId } from '../../../domain/value-objects/AssetId';
import { MediaId } from '../../../domain/value-objects/MediaId';
import { MediaType } from '../../../domain/value-objects/MediaType';
import { MimeType } from '../../../domain/value-objects/MimeType';
import { FileSize } from '../../../domain/value-objects/FileSize';
import { Checksum } from '../../../domain/value-objects/Checksum';
import { MediaStatus } from '../../../domain/enums/MediaStatus';
import { AssetVisibility } from '../../../domain/enums/AssetVisibility';
import { MediaCategory } from '../../../domain/enums/MediaCategory';
import { MediaFile } from '../../../domain/entities/MediaFile';

@Injectable()
export class PrismaAssetRepository implements IAssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(asset: Asset): Promise<void> {
    const metaPayload = {
      visibility: asset.visibility,
      tags: asset.tags,
      uploadedBy: asset.uploadedBy,
    };

    await this.prisma.asset.upsert({
      where: { id: asset.id.value },
      update: {
        status: asset.status,
        version: asset.version,
        isDeleted: asset.isDeleted,
        deletedAt: asset.deletedAt ?? null,
        updatedAt: asset.updatedAt,
        metadata: metaPayload as any,
      },
      create: {
        id: asset.id.value,
        workspaceRef: asset.workspaceRef,
        status: asset.status,
        mediaType: asset.mediaType.value,
        mimeType: asset.mimeType.value,
        checksum: asset.checksum?.value,
        fileSize: asset.fileSize.bytes,
        metadata: metaPayload as any,
        version: asset.version,
        isDeleted: asset.isDeleted,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      },
    });

    for (const file of asset.mediaFiles) {
      await this.prisma.mediaFile.upsert({
        where: { id: file.id.value },
        update: {
          url: file.url,
          metadata: { mimeType: file.mimeType.value } as any,
        },
        create: {
          id: file.id.value,
          assetId: asset.id.value,
          url: file.url,
          bucket: file.bucket ?? null,
          key: file.storageKey ?? null,
          size: file.fileSize.bytes,
          metadata: {
            mimeType: file.mimeType.value,
            checksum: file.checksum?.value,
          } as any,
        },
      });
    }
  }

  public async findById(id: AssetId): Promise<Asset | null> {
    const raw = await this.prisma.asset.findUnique({
      where: { id: id.value },
      include: { mediaFiles: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findByWorkspace(workspaceRef: string): Promise<Asset[]> {
    const raws = await this.prisma.asset.findMany({
      where: { workspaceRef, isDeleted: false },
      include: { mediaFiles: true },
    });
    return raws.map(r => this.toDomain(r));
  }

  public async delete(id: AssetId): Promise<void> {
    await this.prisma.asset.delete({ where: { id: id.value } });
  }

  private toDomain(raw: any): Asset {
    const meta = (raw.metadata as any) ?? {};
    const mediaFiles = (raw.mediaFiles ?? []).map((f: any) =>
      MediaFile.create({
        id: MediaId.create(f.id),
        assetId: AssetId.create(f.assetId),
        url: f.url,
        bucket: f.bucket ?? undefined,
        storageKey: f.key ?? undefined,
        mimeType: MimeType.create((f.metadata as any)?.mimeType ?? 'application/octet-stream'),
        fileSize: FileSize.create(f.size ?? 0n),
        createdAt: f.createdAt,
      }),
    );

    return Asset.reconstitute({
      id: AssetId.create(raw.id),
      workspaceRef: raw.workspaceRef,
      uploadedBy: meta.uploadedBy ?? 'system',
      status: raw.status as MediaStatus,
      mediaType: MediaType.create(raw.mediaType as MediaCategory),
      mimeType: MimeType.create(raw.mimeType),
      fileSize: FileSize.create(raw.fileSize ?? 0n),
      checksum: raw.checksum ? Checksum.create(raw.checksum) : undefined,
      visibility: (meta.visibility ?? AssetVisibility.WORKSPACE) as AssetVisibility,
      tags: meta.tags ?? [],
      mediaFiles,
      version: raw.version,
      isDeleted: raw.isDeleted,
      deletedAt: raw.deletedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
