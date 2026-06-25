import { RetryEngine } from '../execution/RetryEngine';

describe('RetryEngine', () => {
  it('should resolve immediately if operation succeeds', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await RetryEngine.executeWithRetry(fn, 3, 10);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    let attempts = 0;
    const fn = jest.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) throw new Error('Temp Fail');
      return 'success';
    });

    const result = await RetryEngine.executeWithRetry(fn, 3, 10);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw if max retries exceeded', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Fatal'));
    await expect(RetryEngine.executeWithRetry(fn, 3, 10)).rejects.toThrow('Operation failed after 3 attempts');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
