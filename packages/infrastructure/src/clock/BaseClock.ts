import { IClock } from '@rrss-auto/domain';

export abstract class BaseClock implements IClock {
  public abstract now(): Date;
  public abstract nowUnix(): number;
}
