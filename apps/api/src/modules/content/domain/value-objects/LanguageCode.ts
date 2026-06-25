import { ValueObject } from '@rrss-auto/domain';

// BCP 47 language tag e.g. "en", "en-US", "es-419"
interface LanguageCodeProps { value: string; }

export class LanguageCode extends ValueObject<LanguageCodeProps> {
  private constructor(props: LanguageCodeProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): LanguageCode {
    if (!value || value.trim().length === 0) throw new Error('LanguageCode cannot be empty');
    return new LanguageCode({ value: value.trim().toLowerCase() });
  }
}
