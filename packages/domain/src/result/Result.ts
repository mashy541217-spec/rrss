export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: string | Error;

  private constructor(isSuccess: boolean, error?: string | Error, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;
    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Cannot retrieve value from a failed result");
    }
    return this._value!;
  }

  public getError(): string {
    if (this.isSuccess) {
      throw new Error("Cannot retrieve error from a successful result");
    }
    if (this._error instanceof Error) {
      return this._error.message;
    }
    return this._error || "Unknown error";
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string | Error): Result<U> {
    return new Result<U>(false, error);
  }
}
