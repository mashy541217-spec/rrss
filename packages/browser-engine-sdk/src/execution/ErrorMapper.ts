export class BrowserSDKException extends Error {
  constructor(message: string, public readonly engineError?: any) {
    super(message);
    this.name = 'BrowserSDKException';
  }
}

export class ErrorMapper {
  public static mapEngineError(err: any): BrowserSDKException {
    const msg = err?.message?.toLowerCase() || '';
    
    if (msg.includes('timeout')) {
      return new BrowserSDKException(`Operation timed out: ${err.message}`, err);
    }
    if (msg.includes('detached') || msg.includes('stale')) {
      return new BrowserSDKException(`Element is detached from DOM: ${err.message}`, err);
    }
    if (msg.includes('not visible') || msg.includes('hidden')) {
      return new BrowserSDKException(`Element is not visible: ${err.message}`, err);
    }

    return new BrowserSDKException(`Unknown browser engine error: ${err.message}`, err);
  }
}
