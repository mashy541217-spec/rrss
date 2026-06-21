export interface IMessageQueue {
  send<T>(queueName: string, message: T): Promise<void>;
  subscribe<T>(queueName: string, handler: (message: T) => Promise<void>): void;
}
