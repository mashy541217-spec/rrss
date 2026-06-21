import { IRepository } from '@rrss-auto/domain';
import { Membership } from '../aggregates/Membership';
import { MembershipId } from '../value-objects/MembershipId';
import { UserId } from '../value-objects/UserId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';

export interface IMembershipRepository extends IRepository<Membership, MembershipId> {
  save(membership: Membership): Promise<void>;
  findById(id: MembershipId): Promise<Membership | null>;
  findByUserAndWorkspace(userId: UserId, workspaceRef: WorkspaceRef): Promise<Membership | null>;
  findAllByWorkspace(workspaceRef: WorkspaceRef): Promise<Membership[]>;
}
