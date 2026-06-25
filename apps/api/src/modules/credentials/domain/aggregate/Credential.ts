import { AggregateRoot } from '@rrss-auto/domain';
import { CredentialId } from '../value-objects/CredentialId';
import { CredentialName } from '../value-objects/CredentialName';
import { CredentialType } from '../value-objects/CredentialType';
import { CredentialStatus } from '../enums/CredentialStatus';
import { CredentialProvider } from '../enums/CredentialProvider';
import { CredentialScope } from '../enums/CredentialScope';
import { CredentialOwner } from '../value-objects/CredentialOwner';
import { CredentialMetadata } from '../value-objects/CredentialMetadata';
import { CredentialPolicy } from '../value-objects/CredentialPolicy';
import { CredentialVersion } from '../value-objects/CredentialVersion';
import { Secret } from '../entities/Secret';
import { CredentialCreated } from '../events/CredentialCreated';
import { CredentialRotated } from '../events/CredentialRotated';
import { CredentialRevoked } from '../events/CredentialRevoked';
import { CredentialExpired } from '../events/CredentialExpired';
import { SecretVersion } from '../value-objects/SecretVersion';

export interface CredentialProps {
  id: CredentialId;
  name: CredentialName;
  type: CredentialType;
  status: CredentialStatus;
  provider: CredentialProvider;
  scope: CredentialScope;
  ownerId: CredentialOwner;
  metadata: CredentialMetadata;
  policy: CredentialPolicy;
  version: CredentialVersion;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  secrets: Secret[];
}

export class Credential extends AggregateRoot<CredentialProps, CredentialId> {
  public get id(): CredentialId { return this.props.id; }
  public get name(): CredentialName { return this.props.name; }
  public get type(): CredentialType { return this.props.type; }
  public get status(): CredentialStatus { return this.props.status; }
  public get provider(): CredentialProvider { return this.props.provider; }
  public get scope(): CredentialScope { return this.props.scope; }
  public get ownerId(): CredentialOwner { return this.props.ownerId; }
  public get metadata(): CredentialMetadata { return this.props.metadata; }
  public get policy(): CredentialPolicy { return this.props.policy; }
  public get version(): CredentialVersion { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get deletedAt(): Date | undefined { return this.props.deletedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get secrets(): Secret[] { return [...this.props.secrets]; }

  private constructor(props: CredentialProps) {
    super(props, props.id);
  }

  public static create(props: Omit<CredentialProps, 'isDeleted' | 'deletedAt' | 'createdAt' | 'updatedAt' | 'version'>): Credential {
    const credential = new Credential({
      ...props,
      version: CredentialVersion.create(1),
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    credential.addDomainEvent(new CredentialCreated(
      credential.id.value,
      credential.ownerId.ownerId,
      credential.type.value
    ));

    return credential;
  }

  public static reconstitute(props: CredentialProps): Credential {
    return new Credential(props);
  }

  public getActiveSecret(): Secret | undefined {
    return this.props.secrets.find(s => s.isActive);
  }

  public addSecret(secret: Secret): void {
    const activeSecret = this.getActiveSecret();
    if (activeSecret) {
      activeSecret.deactivate();
    }
    this.props.secrets.push(secret);
    
    // Only emit rotated event if it's not the initial secret (v1)
    if (secret.version.value > 1) {
      this.addDomainEvent(new CredentialRotated(this.id.value, secret.version.value));
    }
  }

  public revoke(reason?: string): void {
    if (this.props.status === CredentialStatus.REVOKED) return;

    this.props.status = CredentialStatus.REVOKED;
    const activeSecret = this.getActiveSecret();
    if (activeSecret) {
      activeSecret.deactivate();
    }
    
    this.addDomainEvent(new CredentialRevoked(this.id.value, reason));
  }

  public expire(): void {
    if (this.props.status !== CredentialStatus.ACTIVE) return;
    
    this.props.status = CredentialStatus.EXPIRED;
    const activeSecret = this.getActiveSecret();
    if (activeSecret) {
      activeSecret.deactivate();
    }

    this.addDomainEvent(new CredentialExpired(this.id.value));
  }

  public updateMetadata(newMetadata: CredentialMetadata): void {
    this.props.metadata = newMetadata;
    this.incrementVersion();
  }

  public checkExpiration(): void {
    if (this.props.status === CredentialStatus.ACTIVE && this.props.policy.expiresAt) {
      if (new Date() > this.props.policy.expiresAt) {
        this.expire();
      }
    }
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
  }
}
