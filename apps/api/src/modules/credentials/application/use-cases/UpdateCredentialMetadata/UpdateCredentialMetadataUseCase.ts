import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { UpdateCredentialMetadataCommand } from './UpdateCredentialMetadataCommand';
import { CredentialId } from '../../../domain/value-objects/CredentialId';
import { CredentialMetadata } from '../../../domain/value-objects/CredentialMetadata';

@Injectable()
@CommandHandler(UpdateCredentialMetadataCommand)
export class UpdateCredentialMetadataUseCase implements IUseCase<UpdateCredentialMetadataCommand, void>, ICommandHandler<UpdateCredentialMetadataCommand, void> {
  constructor(
    @Inject('ICredentialRepository') private readonly repository: ICredentialRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateCredentialMetadataCommand): Promise<void> {
    const credentialId = CredentialId.create(command.credentialId);
    const credential = await this.repository.findById(credentialId);

    if (!credential) {
      throw new ApplicationException(`Credential ${command.credentialId} not found`, 'CREDENTIAL_NOT_FOUND');
    }

    credential.updateMetadata(CredentialMetadata.create(command.metadata));

    await this.repository.save(credential);
    await this.eventBus.publishAll(credential.domainEvents);
    credential.clearDomainEvents();
  }
}
