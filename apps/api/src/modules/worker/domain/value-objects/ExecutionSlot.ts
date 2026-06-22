import { ValueObject } from '@rrss-auto/domain';

interface ExecutionSlotProps {
  slotId: number;
  executionId: string | null;
}

export class ExecutionSlot extends ValueObject<ExecutionSlotProps> {
  private constructor(props: ExecutionSlotProps) {
    super(props);
  }

  get slotId(): number { return this.props.slotId; }
  get executionId(): string | null { return this.props.executionId; }
  get isOccupied(): boolean { return this.props.executionId !== null; }

  public static createEmpty(slotId: number): ExecutionSlot {
    return new ExecutionSlot({ slotId, executionId: null });
  }

  public occupy(executionId: string): ExecutionSlot {
    if (this.isOccupied) throw new Error('Slot is already occupied');
    return new ExecutionSlot({ slotId: this.slotId, executionId });
  }

  public free(): ExecutionSlot {
    return ExecutionSlot.createEmpty(this.slotId);
  }
}
