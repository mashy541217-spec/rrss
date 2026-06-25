import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Worker } from '../../../domain/aggregates/Worker';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerMapper } from '../mappers/WorkerMapper';
import { WorkerSessionMapper } from '../mappers/WorkerSessionMapper';
import { HeartbeatMapper } from '../mappers/HeartbeatMapper';
import { AssignmentMapper } from '../mappers/AssignmentMapper';
import { Worker as PrismaWorker } from '@prisma/client';

export interface IWorkerRepository {
  findById(id: WorkerId, scope?: TransactionScope): Promise<Worker | null>;
  save(worker: Worker, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaWorkerRepository
  extends BasePrismaRepository<Worker, WorkerId, PrismaWorker>
  implements IWorkerRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: WorkerMapper,
    private readonly sessionMapper: WorkerSessionMapper,
    private readonly heartbeatMapper: HeartbeatMapper,
    private readonly assignmentMapper: AssignmentMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: WorkerId, scope?: TransactionScope): Promise<Worker | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.worker.findUnique({
      where: { id: id.value },
      include: {
        sessions: { orderBy: { startedAt: 'desc' }, take: 1 },
        heartbeats: { orderBy: { receivedAt: 'desc' }, take: 1 },
        assignments: true
      }
    });

    if (!model || model.isDeleted) return null;

    const worker = this.aggregateMapper.toDomain(model);
    
    if (model.sessions.length > 0) {
      (worker as any).props.currentSession = this.sessionMapper.toDomain(model.sessions[0]);
    }
    
    if (model.heartbeats.length > 0) {
      (worker as any).props.lastHeartbeat = this.heartbeatMapper.toDomain(model.heartbeats[0]);
    }

    if (model.assignments.length > 0) {
      (worker as any).props.assignments = model.assignments.map(a => this.assignmentMapper.toDomain(a));
    }

    return worker;
  }

  async save(worker: Worker, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(worker, scope, async (tx, model) => {
      const existing = await tx.worker.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (worker as any)['_version'] = newVersion;

      if (!existing) {
        await tx.worker.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Worker ${model.id} was modified by another transaction.`);
        }
        await tx.worker.update({
          where: { id: model.id },
          data: model
        });
      }

      // Handle nested entities
      if ((worker as any).props.currentSession) {
        const smodel = this.sessionMapper.toPersistence((worker as any).props.currentSession, worker.id.value);
        await tx.workerSession.upsert({
          where: { id: smodel.id },
          create: smodel,
          update: smodel
        });
      }

      if ((worker as any).props.lastHeartbeat) {
        // Heartbeats are append-only mostly, but for simplicity we insert if it has no ID, but wait, ID is empty in mapper
        const hmodel = this.heartbeatMapper.toPersistence((worker as any).props.lastHeartbeat, worker.id.value);
        hmodel.id = `${worker.id.value}-${hmodel.receivedAt.getTime()}`;
        
        await tx.workerHeartbeat.upsert({
          where: { id: hmodel.id },
          create: hmodel,
          update: hmodel
        });
      }

      for (const assignment of worker.assignments) {
        const amodel = this.assignmentMapper.toPersistence(assignment, worker.id.value);
        amodel.id = `${worker.id.value}-${amodel.jobId}`;
        
        await tx.executionAssignment.upsert({
          where: { id: amodel.id },
          create: amodel,
          update: amodel
        });
      }
    });
  }
}
