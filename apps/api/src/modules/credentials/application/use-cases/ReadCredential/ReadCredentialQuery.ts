import { IQuery } from '@rrss-auto/application';

export class ReadCredentialQuery implements IQuery {
  constructor(
    public readonly credentialId: string,
    public readonly accessorId: string
  ) {}
}
