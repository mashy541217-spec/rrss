import { IMembershipRepository } from '../../../../../../apps/api/src/modules/identity/domain/repositories/IMembershipRepository';
import { Membership } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/Membership';
import { MembershipId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/MembershipId';
import { UserId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/UserId';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';

export class FakeMembershipRepository implements IMembershipRepository {
  private readonly items = new Map<string, Membership>();

  public async save(membership: Membership): Promise<void> {
    this.items.set(membership.id.value, membership);
  }

  public async findById(id: MembershipId): Promise<Membership | null> {
    const membership = this.items.get(id.value);
    return membership || null;
  }

  public async findByUserAndWorkspace(userId: UserId, workspaceRef: WorkspaceRef): Promise<Membership | null> {
    for (const membership of this.items.values()) {
      if (
        membership.userId.value === userId.value &&
        membership.workspaceRef.value === workspaceRef.value
      ) {
        return membership;
      }
    }
    return null;
  }

  public async findAllByWorkspace(workspaceRef: WorkspaceRef): Promise<Membership[]> {
    const memberships: Membership[] = [];
    for (const membership of this.items.values()) {
      if (membership.workspaceRef.value === workspaceRef.value) {
        memberships.push(membership);
      }
    }
    return memberships;
  }

  // Testing helper methods
  public getSavedMemberships(): Membership[] {
    return Array.from(this.items.values());
  }

  public clear(): void {
    this.items.clear();
  }
}
