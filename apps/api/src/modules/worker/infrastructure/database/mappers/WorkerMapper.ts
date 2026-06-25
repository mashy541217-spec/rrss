import { Injectable } from '@nestjs/common';
import { Worker as PrismaWorker } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Worker } from '../../../domain/aggregates/Worker';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerType } from '../../../domain/enums/WorkerType';
import { WorkerEndpoint } from '../../../domain/value-objects/WorkerEndpoint';
import { WorkerCapacity } from '../../../domain/value-objects/WorkerCapacity';
import { WorkerStatus } from '../../../domain/enums/WorkerStatus';
import { WorkerHealth } from '../../../domain/enums/WorkerHealth';

@Injectable()
export class WorkerMapper
  implements
    AggregateMapper<Worker, WorkerId, PrismaWorker>,
    PersistenceMapper<Worker, WorkerId, PrismaWorker>
{
  toDomain(model: PrismaWorker): Worker {
    const caps = model.capabilities as any[];
    
    // Create bare worker
    const worker = (Worker as any).register(
      WorkerId.create(model.id),
      WorkerType.VM, // Default, can be refined based on capabilities
      WorkerEndpoint.create('http://' + model.hostname), // Fake port, domain requires refinement
      WorkerCapacity.create(model.concurrencyLimit)
    );

    (worker as any).props.status = model.status as WorkerStatus;
    (worker as any).props.health = WorkerHealth.Healthy;
    
    (worker as any)['_version'] = model.version;
    worker.clearDomainEvents();
    return worker;
  }

  toPersistence(aggregate: Worker): PrismaWorker {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.id.value,
      hostname: (aggregate as any).props.endpoint.url,
      status: aggregate.status,
      capabilities: [] as any,
      currentJobId: null,
      concurrencyLimit: aggregate.capacity.maxConcurrentExecutions,
      activeJobCount: aggregate.assignments.filter((a: any) => !a.isCompleted).length,
      registeredAt: new Date(),
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
