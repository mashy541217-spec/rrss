import { IClock } from '@rrss-auto/domain';

export class FakeClock implements IClock {
  private currentTime: Date;

  constructor(initialTime: Date = new Date('2026-06-20T00:00:00Z')) {
    this.currentTime = initialTime;
  }

  public now(): Date {
    return this.currentTime;
  }

  public setCurrentTime(date: Date): void {
    this.currentTime = date;
  }

  public tick(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }
}
