import { IEventBus } from '@rrss-auto/application';
import { IExecutionReservationRepository } from '../../../domain/repositories/IExecutionReservationRepository';
import { ReservationId } from '../../../domain/value-objects/ReservationId';
import { ReservationNotFoundException } from '../../../domain/exceptions/ReservationNotFoundException';
import { ReservationExpired } from '../../../domain/domain-events/ReservationExpired';

export interface ReleaseReservationCommand {
  reservationId: string;
  reason: string;
}

export class ReleaseReservationUseCase {
  constructor(
    private readonly reservationRepository: IExecutionReservationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReleaseReservationCommand): Promise<void> {
    const reservation = await this.reservationRepository.findById(ReservationId.create(command.reservationId));
    if (!reservation) throw new ReservationNotFoundException(`Reservation not found: ${command.reservationId}`);

    reservation.release();

    await this.reservationRepository.save(reservation);
    
    // In our simplified domain, releasing acts like expiration/release to free capacity
    await this.eventBus.publish(new ReservationExpired(reservation.id, reservation.executionId));
  }
}
