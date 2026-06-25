import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Job } from '../../../domain/aggregates/Job';
import { JobId } from '../../../domain/value-objects/JobId';
import { JobMapper, PrismaJobFull } from '../mappers/JobMapper';

export interface IJobRepository {
  findById(id: JobId, scope?: TransactionScope): Promise<Job | null>;
  save(job: Job, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaJobRepository
  extends BasePrismaRepository<Job, JobId, PrismaJobFull>
  implements IJobRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: JobMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: JobId, scope?: TransactionScope): Promise<Job | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.job.findUnique({
      where: { id: id.value },
      include: {
        assignments: true
      }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(job: Job, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(job, scope, async (tx, model) => {
      const existing = await tx.job.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (job as any)['_version'] = newVersion;

      if (!existing) {
        await tx.job.create({
          data: {
            ...model,
            assignments: model.assignments ? {
              create: model.assignments
            } : undefined
          }
        });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Job ${model.id} was modified by another transaction.`);
        }

        // Just delete and recreate assignments
        await tx.workerAssignment.deleteMany({ where: { jobId: model.id } });

        await tx.job.update({
          where: { id: model.id },
          data: {
            ...model,
            assignments: model.assignments ? {
              create: model.assignments
            } : undefined
          }
        });
      }
    });
  }
}
