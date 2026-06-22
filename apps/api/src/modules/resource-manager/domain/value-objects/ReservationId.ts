import { ValueObject } from '@rrss-auto/domain';

interface ReservationIdProps {
  value: string;
}

export class ReservationId extends ValueObject<ReservationIdProps> {
  private constructor(props: ReservationIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(id: string): ReservationId {
    if (!id || id.trim().length === 0) {
      throw new Error('ReservationId cannot be empty');
    }
    return new ReservationId({ value: id });
  }
}
