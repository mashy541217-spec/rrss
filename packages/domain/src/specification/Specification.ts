export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

export abstract class Specification<T> implements ISpecification<T> {
  public abstract isSatisfiedBy(candidate: T): boolean;

  public and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  public or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  public not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(private readonly one: ISpecification<T>, private readonly other: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(private readonly one: ISpecification<T>, private readonly other: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return this.one.isSatisfiedBy(candidate) || this.other.isSatisfiedBy(candidate);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private readonly spec: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}
