export interface IIdentifierProvider {
  nextId(): string;
  isValid(id: string): boolean;
}
