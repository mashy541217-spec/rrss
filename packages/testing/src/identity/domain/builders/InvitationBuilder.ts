import { Invitation } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/Invitation';
import { InvitationId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/InvitationId';
import { Email } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/Email';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRoleId';
import { InvitationToken } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/InvitationToken';
import { InvitationStatus } from '../../../../../../apps/api/src/modules/identity/domain/enums/InvitationStatus';

export class InvitationBuilder {
  private id: string = 'inv-123';
  private email: string = 'test@example.com';
  private workspaceRef: string = 'wksp-123';
  private roleId: string = 'role-123';
  private token: string = 'token-123456789012';
  private status: InvitationStatus = InvitationStatus.Pending;
  private expiresAt: Date = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  public static create(): InvitationBuilder {
    return new InvitationBuilder();
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withEmail(email: string): this {
    this.email = email;
    return this;
  }

  public withWorkspaceRef(workspaceRef: string): this {
    this.workspaceRef = workspaceRef;
    return this;
  }

  public withRoleId(roleId: string): this {
    this.roleId = roleId;
    return this;
  }

  public withToken(token: string): this {
    this.token = token;
    return this;
  }

  public withStatus(status: InvitationStatus): this {
    this.status = status;
    return this;
  }

  public withExpiresAt(expiresAt: Date): this {
    this.expiresAt = expiresAt;
    return this;
  }

  public build(): Invitation {
    return Invitation.initialize(
      {
        email: Email.create(this.email),
        workspaceRef: WorkspaceRef.create(this.workspaceRef),
        roleId: WorkspaceRoleId.create(this.roleId),
        token: InvitationToken.create(this.token),
        status: this.status,
        expiresAt: this.expiresAt,
      },
      InvitationId.create(this.id),
    );
  }
}
