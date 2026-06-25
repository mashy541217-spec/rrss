import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { ICredentialRepository } from '../../../domain/repositories/ICredentialRepository';
import { RevokeCredentialCommand } from './RevokeCredentialCommand';
import { CredentialId } from '../../../domain/value-objects/CredentialId';

@Injectable()
@CommandHandler(RevokeCredentialCommand)
export class RevokeCredentialUseCase implements IUseCase<RevokeCredentialCommand, void>, ICommandHandler<RevokeCredentialCommand, void> {
  constructor(
    @Inject('ICredentialRepository') private readonly repository: ICredentialRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RevokeCredentialCommand): Promise<void> {
    const credentialId = CredentialId.create(command.credentialId);
    const credential = await this.repository.findById(credentialId);

    if (!credential) {
      throw new ApplicationException(`Credential ${command.credentialId} not found`, 'CREDENTIAL_NOT_FOUND');
    }

    credential.revoke(command.reason);

    await this.repository.save(credential);
    await this.eventBus.publishAll(credential.domainEvents);
    credential.clearDomainEvents();
  }
}
