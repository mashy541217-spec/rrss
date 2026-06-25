import { Injectable } from '@nestjs/common';
import { WorkerHeartbeat as PrismaWorkerHeartbeat } from '@prisma/client';
import { WorkerHeartbeat } from '../../../domain/aggregates/WorkerHeartbeat';
import { WorkerHealth } from '../../../domain/enums/WorkerHealth';

@Injectable()
export class HeartbeatMapper {
  toDomain(model: PrismaWorkerHeartbeat): WorkerHeartbeat {
    const hb = (WorkerHeartbeat as any).create(
      model.status as WorkerHealth,
      model.cpuUsage ?? 0,
      0 // uptime is lost in DB currently
    );
    (hb as any).props.timestamp = model.receivedAt;
    return hb;
  }

  toPersistence(entity: WorkerHeartbeat, workerId: string): Omit<PrismaWorkerHeartbeat, 'worker'> {
    return {
      id: '', // let db auto-generate or use UUID
      workerId: workerId,
      receivedAt: entity.timestamp,
      cpuUsage: entity.currentLoad,
      memoryUsage: 0,
      status: entity.reportedHealth,
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
