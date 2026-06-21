import { ValueObject } from '../value-object/ValueObject';

export abstract class Entity<T, ID extends ValueObject<any>> {
  protected readonly _id: ID;
  protected readonly props: T;

  protected constructor(props: T, id: ID) {
    this._id = id;
    this.props = props;
  }

  get id(): ID {
    return this._id;
  }

  public equals(other?: Entity<T, ID>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this._id.equals(other._id);
  }
}
