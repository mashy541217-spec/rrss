import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IResourceReservationRepository } from '../../../domain/repositories/IResourceReservationRepository';
import { ResourceReservation } from '../../../domain/aggregates/ResourceReservation';
import { ResourceType } from '../../../domain/value-objects/ResourceType';
import { ReservationId } from '../../../domain/value-objects/ReservationId';

export interface ReserveResourceCommand {
  resourceType: string;
  executionId: string;
  durationSeconds: number;
}

export class ReserveResourceUseCase {
  constructor(
    private readonly reservationRepo: IResourceReservationRepository,
    private readonly eventBus: IEventBus,
    private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: ReserveResourceCommand): Promise<string> {
    const rawId = this.idProvider.nextId();
    const reservation = ResourceReservation.create(
      ResourceType.create(command.resourceType),
      command.executionId,
      command.durationSeconds,
      ReservationId.create(rawId)
    );

    await this.reservationRepo.save(reservation);
    await this.eventBus.publishAll(reservation.domainEvents);
    reservation.clearDomainEvents();

    return rawId;
  }
}
