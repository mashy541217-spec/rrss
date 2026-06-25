export interface AIStreamChunk {
  id: string;
  provider: string;
  model: string;
  delta: string;
  isFinished: boolean;
}
