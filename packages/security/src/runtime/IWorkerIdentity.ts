export interface IWorkerIdentity {
  workerId: string;
  publicKey: string;
  getTemporaryToken(): Promise<string>;
}
