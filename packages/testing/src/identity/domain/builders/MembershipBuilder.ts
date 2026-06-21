import { Membership } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/Membership';
import { MembershipId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/MembershipId';
import { UserId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/UserId';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRoleId';
import { MembershipStatus } from '../../../../../../apps/api/src/modules/identity/domain/enums/MembershipStatus';

export class MembershipBuilder {
  private id: string = 'memb-123';
  private userId: string = 'usr-123';
  private workspaceRef: string = 'wksp-123';
  private roleId: string = 'role-123';
  private status: MembershipStatus = MembershipStatus.Accepted;

  public static create(): MembershipBuilder {
    return new MembershipBuilder();
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withUserId(userId: string): this {
    this.userId = userId;
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

  public withStatus(status: MembershipStatus): this {
    this.status = status;
    return this;
  }

  public build(): Membership {
    return Membership.initialize(
      {
        userId: UserId.create(this.userId),
        workspaceRef: WorkspaceRef.create(this.workspaceRef),
        roleId: WorkspaceRoleId.create(this.roleId),
        status: this.status,
      },
      MembershipId.create(this.id),
    );
  }
}
