export class Guard {
  public static againstNullOrUndefined(value: any, argumentName: string): void {
    if (value === null || value === undefined) {
      throw new Error(`${argumentName} cannot be null or undefined`);
    }
  }

  public static againstEmptyString(value: string, argumentName: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`${argumentName} cannot be empty`);
    }
  }

  public static inRange(num: number, min: number, max: number, argumentName: string): void {
    if (num < min || num > max) {
      throw new Error(`${argumentName} must be between ${min} and ${max}`);
    }
  }
}
