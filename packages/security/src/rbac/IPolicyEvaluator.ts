export interface IPolicyEvaluator {
  canExecute(subjectId: string, action: string, resourceId: string): Promise<boolean>;
}
