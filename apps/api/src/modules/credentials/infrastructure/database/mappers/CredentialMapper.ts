import { Credential } from '../../../domain/aggregate/Credential';
import { Credential as PrismaCredential, CredentialSecret as PrismaSecret } from '@prisma/client';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { CredentialName } from '../../../domain/value-objects/CredentialName';
import { CredentialType } from '../../../domain/value-objects/CredentialType';
import { CredentialStatus } from '../../../domain/enums/CredentialStatus';
import { CredentialProvider } from '../../../domain/enums/CredentialProvider';
import { CredentialScope } from '../../../domain/enums/CredentialScope';
import { CredentialOwner } from '../../../domain/value-objects/CredentialOwner';
import { CredentialMetadata } from '../../../domain/value-objects/CredentialMetadata';
import { CredentialPolicy } from '../../../domain/value-objects/CredentialPolicy';
import { CredentialVersion } from '../../../domain/value-objects/CredentialVersion';
import { SecretMapper } from './SecretMapper';
import { RotationPolicy } from '../../../domain/enums/RotationPolicy';

type PrismaCredentialWithSecrets = PrismaCredential & { secrets?: PrismaSecret[] };

export class CredentialMapper {
  public static toDomain(raw: PrismaCredentialWithSecrets): Credential {
    const policyData = raw.policy as Record<string, any>;

    const props = {
      id: CredentialId.create(raw.id),
      name: CredentialName.create(raw.name),
      type: CredentialType.create(raw.type),
      status: raw.status as CredentialStatus,
      provider: raw.provider as CredentialProvider,
      scope: raw.scope as CredentialScope,
      ownerId: CredentialOwner.create(raw.ownerId),
      metadata: CredentialMetadata.create(raw.metadata as Record<string, any>),
      policy: CredentialPolicy.create({
        rotationPolicy: policyData.rotationPolicy as RotationPolicy,
        requiresMfa: policyData.requiresMfa,
        expiresAt: policyData.expiresAt ? new Date(policyData.expiresAt) : undefined
      }),
      version: CredentialVersion.create(raw.version),
      isDeleted: raw.isDeleted,
      deletedAt: raw.deletedAt || undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      secrets: (raw.secrets || []).map(SecretMapper.toDomain)
    };

    const credential = Credential.reconstitute(props);
    (credential as any).businessId = raw.businessId;
    return credential;
  }

  public static toPersistence(credential: Credential): PrismaCredentialWithSecrets {
    const policyProps = {
      rotationPolicy: credential.policy.rotationPolicy,
      requiresMfa: credential.policy.requiresMfa,
      expiresAt: credential.policy.expiresAt?.toISOString()
    };

    return {
      id: credential.id.value,
      name: credential.name.value,
      type: credential.type.value,
      status: credential.status,
      provider: credential.provider,
      scope: credential.scope,
      ownerId: credential.ownerId.ownerId,
      businessId: (credential as any).businessId ?? null,
      metadata: credential.metadata.data,
      policy: policyProps,
      version: credential.version.value,
      isDeleted: credential.isDeleted,
      deletedAt: credential.deletedAt || null,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
      secrets: credential.secrets.map(SecretMapper.toPersistence)
    };
  }
}
