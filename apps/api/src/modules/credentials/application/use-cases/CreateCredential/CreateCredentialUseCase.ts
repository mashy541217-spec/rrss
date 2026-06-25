import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { Credential } from '../../../domain/aggregate/Credential';
import { CreateCredentialCommand } from './CreateCredentialCommand';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { CredentialName } from '../../../domain/value-objects/CredentialName';
import { CredentialType } from '../../../domain/value-objects/CredentialType';
import { CredentialStatus } from '../../../domain/enums/CredentialStatus';
import { CredentialOwner } from '../../../domain/value-objects/CredentialOwner';
import { CredentialMetadata } from '../../../domain/value-objects/CredentialMetadata';
import { CredentialPolicy } from '../../../domain/value-objects/CredentialPolicy';
import { Secret } from '../../../domain/entities/Secret';
import { SecretVersion } from '../../../domain/value-objects/SecretVersion';
import { EncryptedSecret } from '../../../domain/value-objects/EncryptedSecret';
import { SecretAlgorithm } from '../../../domain/enums/SecretAlgorithm';
import { SecretId } from '../../../domain/value-objects/SecretId';

export interface IEncryptionService {
  encrypt(plainText: string): Promise<{ encryptedValue: string; algorithm: string; keyReference?: string }>;
  decrypt(encryptedValue: string, algorithm: string, keyReference?: string): Promise<string>;
}

@Injectable()
@CommandHandler(CreateCredentialCommand)
export class CreateCredentialUseCase implements IUseCase<CreateCredentialCommand, string>, ICommandHandler<CreateCredentialCommand, string> {
  constructor(
    @Inject('ICredentialRepository') private readonly repository: ICredentialRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
    @Inject('IEncryptionService') private readonly encryptionService: IEncryptionService
  ) {}

  public async execute(command: CreateCredentialCommand): Promise<string> {
    const rawId = this.identifierProvider.nextId();
    const id = CredentialId.create(rawId);
    
    const credential = Credential.create({
      id,
      name: CredentialName.create(command.name),
      type: CredentialType.create(command.type),
      status: CredentialStatus.ACTIVE,
      provider: command.provider,
      scope: command.scope,
      ownerId: CredentialOwner.create(command.ownerId),
      metadata: CredentialMetadata.create(command.metadata),
      policy: CredentialPolicy.create(command.policy),
      secrets: [] // Initialized below
    });

    const encryptedData = await this.encryptionService.encrypt(command.plainTextSecret);

    const secret = Secret.create({
      id: SecretId.create(this.identifierProvider.nextId()),
      credentialId: id.value,
      version: SecretVersion.create(1),
      encryptedValue: EncryptedSecret.create(encryptedData.encryptedValue),
      algorithm: encryptedData.algorithm as SecretAlgorithm,
      isActive: true,
      createdAt: new Date()
    });

    credential.addSecret(secret);

    await this.repository.save(credential);
    await this.eventBus.publishAll(credential.domainEvents);
    credential.clearDomainEvents();

    return rawId;
  }
}
