import { Secret } from '../../../domain/entities/Secret';
import { CredentialSecret as PrismaSecret } from '@prisma/client';
import { SecretVersion } from '../../../domain/value-objects/SecretVersion';
import { EncryptedSecret } from '../../../domain/value-objects/EncryptedSecret';
import { SecretAlgorithm } from '../../../domain/enums/SecretAlgorithm';
import { VaultReference } from '../../../domain/value-objects/VaultReference';
import { EncryptionKeyReference } from '../../../domain/value-objects/EncryptionKeyReference';
import { SecretId } from '../../../domain/value-objects/SecretId';

export class SecretMapper {
  public static toDomain(prismaSecret: PrismaSecret): Secret {
    return Secret.create({
      id: SecretId.create(prismaSecret.id),
      credentialId: prismaSecret.credentialId,
      version: SecretVersion.create(prismaSecret.version),
      encryptedValue: EncryptedSecret.create(prismaSecret.encryptedValue),
      algorithm: prismaSecret.algorithm as SecretAlgorithm,
      encryptionKeyReference: prismaSecret.encryptionKeyReference 
        ? EncryptionKeyReference.create(prismaSecret.encryptionKeyReference) 
        : undefined,
      vaultReference: prismaSecret.vaultReference 
        ? VaultReference.create(prismaSecret.vaultReference) 
        : undefined,
      isActive: prismaSecret.isActive,
      createdAt: prismaSecret.createdAt
    });
  }

  public static toPersistence(secret: Secret): Omit<PrismaSecret, 'credentialId'> & { credentialId: string } {
    return {
      id: secret.id.value,
      credentialId: secret.credentialId,
      version: secret.version.value,
      encryptedValue: secret.encryptedValue.value,
      algorithm: secret.algorithm,
      encryptionKeyReference: secret.encryptionKeyReference?.keyId || null,
      vaultReference: secret.vaultReference?.value || null,
      isActive: secret.isActive,
      createdAt: secret.createdAt
    };
  }
}
