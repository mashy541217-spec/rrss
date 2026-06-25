import { Injectable } from '@nestjs/common';
import { ExecutionAssignment as PrismaExecutionAssignment } from '@prisma/client';
import { ExecutionAssignment } from '../../../domain/aggregates/ExecutionAssignment';

@Injectable()
export class AssignmentMapper {
  toDomain(model: PrismaExecutionAssignment): ExecutionAssignment {
    const assignment = (ExecutionAssignment as any).create(model.executionId, parseInt(model.jobId, 10) || 0); // slotId mapped to jobId
    (assignment as any).props.assignedAt = model.assignedAt;
    if (model.status === 'COMPLETED') {
      (assignment as any).props.status = 'COMPLETED'; // AssignmentStatus.Completed is likely a string or enum
      (assignment as any).props.completedAt = model.completedAt;
    }
    return assignment;
  }

  toPersistence(entity: ExecutionAssignment, workerId: string): Omit<PrismaExecutionAssignment, 'worker'> {
    return {
      id: '', // db generated
      workerId: workerId,
      executionId: entity.executionId,
      jobId: entity.slotId.toString(), // mapped
      status: entity.completedAt ? 'COMPLETED' : 'ACTIVE',
      assignedAt: entity.assignedAt,
      completedAt: entity.completedAt ?? null,
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
