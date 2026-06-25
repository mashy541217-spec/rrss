export class WaitingEngine {
  public static async waitForCondition(conditionFn: () => Promise<boolean>, timeoutMs = 30000, pollIntervalMs = 500): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await conditionFn()) {
        return true;
      }
      await new Promise(res => setTimeout(res, pollIntervalMs));
    }
    throw new Error(`Timeout after ${timeoutMs}ms waiting for condition.`);
  }
}
