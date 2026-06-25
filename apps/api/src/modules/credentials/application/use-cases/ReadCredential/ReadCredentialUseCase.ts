import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { ReadCredentialQuery } from './ReadCredentialQuery';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { CredentialAccessed } from '../../../domain/events/CredentialAccessed';
import { IEncryptionService } from '../CreateCredential/CreateCredentialUseCase';
import { CredentialStatus } from '../../../domain/enums/CredentialStatus';

export interface ReadCredentialResult {
  id: string;
  name: string;
  type: string;
  plainTextSecret: string;
  version: number;
}

@Injectable()
@QueryHandler(ReadCredentialQuery)
export class ReadCredentialUseCase implements IUseCase<ReadCredentialQuery, ReadCredentialResult>, IQueryHandler<ReadCredentialQuery, ReadCredentialResult> {
  constructor(
    @Inject('ICredentialRepository') private readonly repository: ICredentialRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IEncryptionService') private readonly encryptionService: IEncryptionService
  ) {}

  public async execute(query: ReadCredentialQuery): Promise<ReadCredentialResult> {
    const credentialId = CredentialId.create(query.credentialId);
    const credential = await this.repository.findById(credentialId);

    if (!credential || credential.isDeleted) {
      throw new ApplicationException(`Credential ${query.credentialId} not found`, 'CREDENTIAL_NOT_FOUND');
    }

    credential.checkExpiration();
    if (credential.status !== CredentialStatus.ACTIVE) {
      if (credential.status === CredentialStatus.EXPIRED) {
        await this.repository.save(credential);
        await this.eventBus.publishAll(credential.domainEvents);
        credential.clearDomainEvents();
        throw new ApplicationException(`Credential has expired`, 'CREDENTIAL_EXPIRED');
      }
      throw new ApplicationException(`Credential is not active`, 'CREDENTIAL_NOT_ACTIVE');
    }

    const activeSecret = credential.getActiveSecret();
    if (!activeSecret) {
      throw new ApplicationException(`Credential has no active secret`, 'CREDENTIAL_NO_SECRET');
    }

    const plainTextSecret = await this.encryptionService.decrypt(
      activeSecret.encryptedValue.value,
      activeSecret.algorithm,
      activeSecret.encryptionKeyReference?.keyId
    );

    const accessedEvent = new CredentialAccessed(query.credentialId, query.accessorId);
    await this.eventBus.publish(accessedEvent);

    return {
      id: credential.id.value,
      name: credential.name.value,
      type: credential.type.value,
      plainTextSecret,
      version: activeSecret.version.value
    };
  }
}
