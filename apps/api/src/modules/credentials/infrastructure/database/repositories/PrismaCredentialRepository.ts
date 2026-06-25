import { Injectable } from '@nestjs/common';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { Credential } from '../../../domain/aggregate/Credential';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { CredentialMapper } from '../mappers/CredentialMapper';
import { ApplicationException } from '@rrss-auto/application';

@Injectable()
export class PrismaCredentialRepository implements ICredentialRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(credential: Credential): Promise<void> {
    const raw = CredentialMapper.toPersistence(credential);
    
    // We use a transaction to save the credential and its secrets
    await this.prisma.$transaction(async (tx) => {
      // Optimistic locking check if updating
      if (raw.version > 1) {
        const current = await tx.credential.findUnique({
          where: { id: raw.id }
        });

        if (current && current.version !== raw.version - 1) {
          throw new ApplicationException(`Concurrency conflict for Credential ${raw.id}`, 'CONCURRENCY_CONFLICT');
        }
      }

      await tx.credential.upsert({
        where: { id: raw.id },
        create: {
          id: raw.id,
          name: raw.name,
          type: raw.type,
          status: raw.status,
          provider: raw.provider,
          scope: raw.scope,
          ownerId: raw.ownerId,
          metadata: raw.metadata as any,
          policy: raw.policy as any,
          version: raw.version,
          isDeleted: raw.isDeleted,
          deletedAt: raw.deletedAt,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        },
        update: {
          name: raw.name,
          type: raw.type,
          status: raw.status,
          provider: raw.provider,
          scope: raw.scope,
          ownerId: raw.ownerId,
          metadata: raw.metadata as any,
          policy: raw.policy as any,
          version: raw.version,
          isDeleted: raw.isDeleted,
          deletedAt: raw.deletedAt,
          updatedAt: raw.updatedAt,
        }
      });

      // Update secrets (we do an upsert for each secret to handle inserts and deactivations)
      for (const secret of raw.secrets) {
        await tx.credentialSecret.upsert({
          where: { 
            credentialId_version: {
              credentialId: secret.credentialId,
              version: secret.version
            }
          },
          create: {
            id: secret.id,
            credentialId: secret.credentialId,
            version: secret.version,
            encryptedValue: secret.encryptedValue,
            algorithm: secret.algorithm,
            encryptionKeyReference: secret.encryptionKeyReference,
            vaultReference: secret.vaultReference,
            isActive: secret.isActive,
            createdAt: secret.createdAt
          },
          update: {
            isActive: secret.isActive
          }
        });
      }
    });
  }

  public async findById(id: CredentialId): Promise<Credential | null> {
    const raw = await this.prisma.credential.findUnique({
      where: { id: id.value },
      include: { secrets: true }
    });

    if (!raw) return null;

    return CredentialMapper.toDomain(raw);
  }

  public async delete(id: CredentialId): Promise<void> {
    await this.prisma.credential.delete({
      where: { id: id.value }
    });
  }
}
