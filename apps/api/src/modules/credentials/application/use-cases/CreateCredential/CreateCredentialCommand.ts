import { ICommand } from '@rrss-auto/application';
import { RotationPolicy } from '../../../domain/enums/RotationPolicy';
import { CredentialProvider } from '../../../domain/enums/CredentialProvider';
import { CredentialScope } from '../../../domain/enums/CredentialScope';

export class CreateCredentialCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly provider: CredentialProvider,
    public readonly scope: CredentialScope,
    public readonly ownerId: string,
    public readonly plainTextSecret: string,
    public readonly metadata: Record<string, any> = {},
    public readonly policy: {
      rotationPolicy: RotationPolicy;
      requiresMfa?: boolean;
      expiresAt?: Date;
    }
  ) {}
}
