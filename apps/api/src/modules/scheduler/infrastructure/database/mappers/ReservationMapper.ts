import { Injectable } from '@nestjs/common';
import { ExecutionReservation as PrismaExecutionReservation } from '@prisma/client';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { ExecutionReservation, ExecutionReservationProps } from '../../../domain/aggregates/ExecutionReservation';
import { ReservationId } from '../../../domain/value-objects/ReservationId';

@Injectable()
export class ReservationMapper {
  toDomain(model: PrismaExecutionReservation): ExecutionReservation {
    const props: ExecutionReservationProps = {
      executionId: model.executionId,
      workerId: model.workerId,
      reservedAt: model.reservedAt,
      expiresAt: model.expiresAt,
      status: model.status as any,
    };

    const reservation = (ExecutionReservation as any).create(props, ReservationId.create(model.id));
    (reservation as any).props.status = model.status;
    return reservation;
  }

  toPersistence(entity: ExecutionReservation): PrismaExecutionReservation {
    return {
      id: entity.id.value,
      executionId: entity.executionId,
      workerId: entity.workerId,
      reservedAt: entity.reservedAt,
      expiresAt: entity.expiresAt,
      status: entity.status,
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
