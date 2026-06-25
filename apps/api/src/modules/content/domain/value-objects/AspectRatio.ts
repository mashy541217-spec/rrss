import { ValueObject } from '@rrss-auto/domain';

// Stores a rational ratio like "16:9", "4:3", "1:1", "9:16"
interface AspectRatioProps { width: number; height: number; }

export class AspectRatio extends ValueObject<AspectRatioProps> {
  private constructor(props: AspectRatioProps) { super(props); }
  get width(): number { return this.props.width; }
  get height(): number { return this.props.height; }
  get decimal(): number { return this.props.width / this.props.height; }
  toString(): string { return `${this.props.width}:${this.props.height}`; }
  public static create(width: number, height: number): AspectRatio {
    if (width <= 0 || height <= 0) throw new Error('AspectRatio dimensions must be positive');
    return new AspectRatio({ width, height });
  }
  public static fromString(value: string): AspectRatio {
    const [w, h] = value.split(':').map(Number);
    return AspectRatio.create(w, h);
  }
  public static SQUARE = AspectRatio.create(1, 1);
  public static LANDSCAPE = AspectRatio.create(16, 9);
  public static PORTRAIT = AspectRatio.create(9, 16);
}
