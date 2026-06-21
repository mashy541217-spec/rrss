import { Invitation } from '../aggregates/Invitation';
import { InvitationId } from '../value-objects/InvitationId';
import { Email } from '../value-objects/Email';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { InvitationToken } from '../value-objects/InvitationToken';

export interface SendInvitationProps {
  id: InvitationId;
  email: Email;
  workspaceRef: WorkspaceRef;
  roleId: WorkspaceRoleId;
  token: InvitationToken;
  expiresAt: Date;
}

export class InvitationFactory {
  public static send(props: SendInvitationProps): Invitation {
    return Invitation.send(
      {
        email: props.email,
        workspaceRef: props.workspaceRef,
        roleId: props.roleId,
        token: props.token,
        expiresAt: props.expiresAt,
      },
      props.id,
    );
  }
}
