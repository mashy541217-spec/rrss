import { IRepository } from '@rrss-auto/domain';
import { Invitation } from '../aggregates/Invitation';
import { InvitationId } from '../value-objects/InvitationId';
import { Email } from '../value-objects/Email';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';

export interface IInvitationRepository extends IRepository<Invitation, InvitationId> {
  save(invitation: Invitation): Promise<void>;
  findById(id: InvitationId): Promise<Invitation | null>;
  findPendingByEmailAndWorkspace(email: Email, workspaceRef: WorkspaceRef): Promise<Invitation | null>;
  findAllPendingByWorkspace(workspaceRef: WorkspaceRef): Promise<Invitation[]>;
}
