import { IInvitationRepository } from '../../../../../../apps/api/src/modules/identity/domain/repositories/IInvitationRepository';
import { Invitation } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/Invitation';
import { InvitationId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/InvitationId';
import { Email } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/Email';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';
import { InvitationStatus } from '../../../../../../apps/api/src/modules/identity/domain/enums/InvitationStatus';

export class FakeInvitationRepository implements IInvitationRepository {
  private readonly items = new Map<string, Invitation>();

  public async save(invitation: Invitation): Promise<void> {
    this.items.set(invitation.id.value, invitation);
  }

  public async findById(id: InvitationId): Promise<Invitation | null> {
    const invitation = this.items.get(id.value);
    return invitation || null;
  }

  public async findPendingByEmailAndWorkspace(email: Email, workspaceRef: WorkspaceRef): Promise<Invitation | null> {
    for (const invitation of this.items.values()) {
      if (
        invitation.email.value.toLowerCase() === email.value.toLowerCase() &&
        invitation.workspaceRef.value === workspaceRef.value &&
        invitation.status === InvitationStatus.Pending
      ) {
        return invitation;
      }
    }
    return null;
  }

  public async findAllPendingByWorkspace(workspaceRef: WorkspaceRef): Promise<Invitation[]> {
    const invitations: Invitation[] = [];
    for (const invitation of this.items.values()) {
      if (
        invitation.workspaceRef.value === workspaceRef.value &&
        invitation.status === InvitationStatus.Pending
      ) {
        invitations.push(invitation);
      }
    }
    return invitations;
  }

  // Testing helper methods
  public getSavedInvitations(): Invitation[] {
    return Array.from(this.items.values());
  }

  public clear(): void {
    this.items.clear();
  }
}
