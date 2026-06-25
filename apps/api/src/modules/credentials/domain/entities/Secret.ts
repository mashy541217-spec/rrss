import { Entity } from '@rrss-auto/domain';
import { EncryptedSecret } from '../value-objects/EncryptedSecret';
import { SecretVersion } from '../value-objects/SecretVersion';
import { SecretAlgorithm } from '../enums/SecretAlgorithm';
import { VaultReference } from '../value-objects/VaultReference';
import { EncryptionKeyReference } from '../value-objects/EncryptionKeyReference';
import { SecretId } from '../value-objects/SecretId';

export interface SecretProps {
  id: SecretId;
  credentialId: string;
  version: SecretVersion;
  encryptedValue: EncryptedSecret;
  algorithm: SecretAlgorithm;
  encryptionKeyReference?: EncryptionKeyReference;
  vaultReference?: VaultReference;
  isActive: boolean;
  createdAt: Date;
}

export class Secret extends Entity<SecretProps, SecretId> {
  public get id(): SecretId { return this.props.id; }
  public get credentialId(): string { return this.props.credentialId; }
  public get version(): SecretVersion { return this.props.version; }
  public get encryptedValue(): EncryptedSecret { return this.props.encryptedValue; }
  public get algorithm(): SecretAlgorithm { return this.props.algorithm; }
  public get encryptionKeyReference(): EncryptionKeyReference | undefined { return this.props.encryptionKeyReference; }
  public get vaultReference(): VaultReference | undefined { return this.props.vaultReference; }
  public get isActive(): boolean { return this.props.isActive; }
  public get createdAt(): Date { return this.props.createdAt; }

  private constructor(props: SecretProps) {
    super(props, props.id);
  }

  public static create(props: SecretProps): Secret {
    return new Secret(props);
  }

  public deactivate(): void {
    this.props.isActive = false;
  }
}
