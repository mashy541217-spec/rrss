import { ISpecification } from './ISpecification';

export class HeartbeatExpiredSpecification implements ISpecification<{ lastHeartbeat: Date, thresholdSeconds: number }> {
  isSatisfiedBy(candidate: { lastHeartbeat: Date, thresholdSeconds: number }): boolean {
    const now = new Date();
    const diffSeconds = (now.getTime() - candidate.lastHeartbeat.getTime()) / 1000;
    return diffSeconds > candidate.thresholdSeconds;
  }
}
