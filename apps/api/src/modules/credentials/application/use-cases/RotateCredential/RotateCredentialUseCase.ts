import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { RotateCredentialCommand } from './RotateCredentialCommand';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { Secret } from '../../../domain/entities/Secret';
import { SecretVersion } from '../../../domain/value-objects/SecretVersion';
import { EncryptedSecret } from '../../../domain/value-objects/EncryptedSecret';
import { SecretAlgorithm } from '../../../domain/enums/SecretAlgorithm';
import { IEncryptionService } from '../CreateCredential/CreateCredentialUseCase'; // Import from here for now, we'll refactor
import { SecretId } from '../../../domain/value-objects/SecretId';

@Injectable()
@CommandHandler(RotateCredentialCommand)
export class RotateCredentialUseCase implements IUseCase<RotateCredentialCommand, void>, ICommandHandler<RotateCredentialCommand, void> {
  constructor(
    @Inject('ICredentialRepository') private readonly repository: ICredentialRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
    @Inject('IEncryptionService') private readonly encryptionService: IEncryptionService
  ) {}

  public async execute(command: RotateCredentialCommand): Promise<void> {
    const credentialId = CredentialId.create(command.credentialId);
    const credential = await this.repository.findById(credentialId);

    if (!credential) {
      throw new ApplicationException(`Credential ${command.credentialId} not found`, 'CREDENTIAL_NOT_FOUND');
    }

    const encryptedData = await this.encryptionService.encrypt(command.plainTextSecret);
    
    const activeSecret = credential.getActiveSecret();
    const newVersionNum = activeSecret ? activeSecret.version.value + 1 : 1;

    const secret = Secret.create({
      id: SecretId.create(this.identifierProvider.nextId()),
      credentialId: credential.id.value,
      version: SecretVersion.create(newVersionNum),
      encryptedValue: EncryptedSecret.create(encryptedData.encryptedValue),
      algorithm: encryptedData.algorithm as SecretAlgorithm,
      isActive: true,
      createdAt: new Date()
    });

    credential.addSecret(secret);

    await this.repository.save(credential);
    await this.eventBus.publishAll(credential.domainEvents);
    credential.clearDomainEvents();
  }
}
