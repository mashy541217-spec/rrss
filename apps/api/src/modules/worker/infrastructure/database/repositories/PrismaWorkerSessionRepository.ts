import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { WorkerSession } from '../../../domain/aggregates/WorkerSession';
import { ValueObject } from '@rrss-auto/domain';
import { WorkerSessionMapper } from '../mappers/WorkerSessionMapper';
import { WorkerSession as PrismaWorkerSession } from '@prisma/client';

export interface IWorkerSessionRepository {
  // Methods for querying sessions directly if needed
}

@Injectable()
export class PrismaWorkerSessionRepository
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: WorkerSessionMapper
  ) {}

  async findById(id: string, scope?: TransactionScope): Promise<WorkerSession | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.workerSession.findUnique({
      where: { id }
    });

    if (!model || model.isDeleted) return null;

    return this.mapper.toDomain(model);
  }

  async save(session: WorkerSession, workerId: string, scope: TransactionScope): Promise<void> {
    const client = scope ? scope.client : this.prisma;
    const model = this.mapper.toPersistence(session, workerId);
    
    await client.workerSession.upsert({
      where: { id: model.id },
      create: model,
      update: model
    });
  }
}
