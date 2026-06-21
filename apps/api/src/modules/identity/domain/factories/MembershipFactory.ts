import { Membership } from '../aggregates/Membership';
import { MembershipId } from '../value-objects/MembershipId';
import { UserId } from '../value-objects/UserId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';

export interface InviteMemberProps {
  id: MembershipId;
  userId: UserId;
  workspaceRef: WorkspaceRef;
  roleId: WorkspaceRoleId;
}

export class MembershipFactory {
  public static invite(props: InviteMemberProps): Membership {
    return Membership.invite(
      {
        userId: props.userId,
        workspaceRef: props.workspaceRef,
        roleId: props.roleId,
      },
      props.id,
    );
  }
}
