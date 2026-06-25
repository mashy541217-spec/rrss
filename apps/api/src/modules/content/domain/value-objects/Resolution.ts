import { ValueObject } from '@rrss-auto/domain';

interface ResolutionProps { width: number; height: number; }

export class Resolution extends ValueObject<ResolutionProps> {
  private constructor(props: ResolutionProps) { super(props); }
  get width(): number { return this.props.width; }
  get height(): number { return this.props.height; }
  get aspectRatio(): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(this.props.width, this.props.height);
    return `${this.props.width / d}:${this.props.height / d}`;
  }
  toString(): string { return `${this.props.width}x${this.props.height}`; }
  public static create(width: number, height: number): Resolution {
    if (width <= 0 || height <= 0) throw new Error('Resolution dimensions must be positive');
    return new Resolution({ width, height });
  }
  public static fromString(value: string): Resolution {
    const [w, h] = value.split('x').map(Number);
    return Resolution.create(w, h);
  }
}
