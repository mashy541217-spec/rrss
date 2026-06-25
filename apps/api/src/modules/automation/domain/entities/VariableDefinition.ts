export class VariableDefinition {
  constructor(
    public readonly name: string,
    public readonly value: any,
    public readonly type: string
  ) {}

  public static create(name: string, value: any, type: string): VariableDefinition {
    return new VariableDefinition(name, value, type);
  }
}
