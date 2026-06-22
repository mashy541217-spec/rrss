import { ResourceReservation } from '../aggregates/ResourceReservation';
import { ReservationId } from '../value-objects/ReservationId';

export interface IResourceReservationRepository {
  save(reservation: ResourceReservation): Promise<void>;
  findById(id: ReservationId): Promise<ResourceReservation | null>;
  delete(id: ReservationId): Promise<void>;
}
