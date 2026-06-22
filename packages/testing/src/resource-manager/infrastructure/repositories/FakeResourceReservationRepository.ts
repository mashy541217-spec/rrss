import { IResourceReservationRepository, ResourceReservation, ReservationId } from '../../../../../../apps/api/src/modules/resource-manager/domain';

export class FakeResourceReservationRepository implements IResourceReservationRepository {
  public reservations = new Map<string, ResourceReservation>();

  public async save(reservation: ResourceReservation): Promise<void> {
    this.reservations.set(reservation.id.value, reservation);
  }

  public async findById(id: ReservationId): Promise<ResourceReservation | null> {
    return this.reservations.get(id.value) || null;
  }

  public async delete(id: ReservationId): Promise<void> {
    this.reservations.delete(id.value);
  }
}
