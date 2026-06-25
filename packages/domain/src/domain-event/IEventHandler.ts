export interface IEventHandler<TEvent = any> {
  /**
   * Handles the event asynchronously
   */
  handle(event: TEvent): Promise<void>;
}
