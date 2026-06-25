import { Injectable } from '@nestjs/common';
import { WorkerSession as PrismaWorkerSession } from '@prisma/client';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { WorkerSession } from '../../../domain/aggregates/WorkerSession';

@Injectable()
export class WorkerSessionMapper {
  toDomain(model: PrismaWorkerSession): WorkerSession {
    const session = (WorkerSession as any).create(model.id);
    (session as any).props.connectedAt = model.startedAt;
    (session as any).props.disconnectedAt = model.endedAt ?? null;
    (session as any).props.disconnectReason = model.status; // Using status field for reason or mapping it loosely
    return session;
  }

  toPersistence(entity: WorkerSession, workerId: string): Omit<PrismaWorkerSession, 'worker'> {
    return {
      id: entity.sessionId,
      workerId: workerId,
      startedAt: entity.connectedAt,
      endedAt: entity.disconnectedAt ?? null,
      status: entity.isActive ? 'ACTIVE' : 'ENDED',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
