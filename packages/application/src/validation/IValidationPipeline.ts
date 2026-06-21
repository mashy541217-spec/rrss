export interface IValidationPipeline<TRequest> {
  validate(request: TRequest): Promise<void>;
}
