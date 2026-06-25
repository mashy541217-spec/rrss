export class TypingSimulator {
  /**
   * Generates a randomized keystroke delay array based on a base typing speed.
   * Helps engines pause between individual key presses.
   */
  public static generateTypingDelays(textLength: number, baseDelayMs = 50, varianceMs = 20): number[] {
    const delays: number[] = [];
    for (let i = 0; i < textLength; i++) {
      // Occasional "hesitation" pause
      const isHesitation = Math.random() > 0.95;
      const hesitation = isHesitation ? (Math.random() * 300) : 0;
      
      const jitter = (Math.random() * varianceMs * 2) - varianceMs;
      delays.push(Math.max(10, baseDelayMs + jitter + hesitation));
    }
    return delays;
  }
}
