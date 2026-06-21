import { ValueObject } from '@rrss-auto/domain';

/**
 * IdempotencyKey – unique caller-supplied key that prevents duplicate Executions
 * and tracks which Steps have already produced external effects.
 *
 * RFC-0001: "Each Execution must have an idempotency key.
 *            Each Step that can cause external effect must have its own key."
 */
export interface IdempotencyKeyProps { value: string; }

export class IdempotencyKey extends ValueObject<IdempotencyKeyProps> {
  public static readonly MIN_LENGTH = 8;
  public static readonly MAX_LENGTH = 255;

  private constructor(props: IdempotencyKeyProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): IdempotencyKey {
    const trimmed = value?.trim() ?? '';
    if (trimmed.length < IdempotencyKey.MIN_LENGTH) {
      throw new Error(`IdempotencyKey must be at least ${IdempotencyKey.MIN_LENGTH} characters`);
    }
    if (trimmed.length > IdempotencyKey.MAX_LENGTH) {
      throw new Error(`IdempotencyKey must be at most ${IdempotencyKey.MAX_LENGTH} characters`);
    }
    return new IdempotencyKey({ value: trimmed });
  }
}
