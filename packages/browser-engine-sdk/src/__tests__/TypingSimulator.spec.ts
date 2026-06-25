import { TypingSimulator } from '../humanization/TypingSimulator';

describe('TypingSimulator', () => {
  it('should generate delays matching text length', () => {
    const textLength = 50;
    const delays = TypingSimulator.generateTypingDelays(textLength, 50, 20);
    
    expect(delays).toHaveLength(textLength);
    // Values should mostly be around baseDelayMs
    delays.forEach(delay => {
      expect(delay).toBeGreaterThanOrEqual(10); // Hardcoded absolute minimum
    });
  });
});
