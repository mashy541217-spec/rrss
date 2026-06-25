export class RestApiAdapter {
  async execute(endpoint: string, method: string, payload: any): Promise<any> {
    console.log(`[WooRestApi] Executing ${method} ${endpoint} for single record.`);
    return { status: 'SUCCESS_REST' };
  }
}

export class BatchApiAdapter {
  async execute(endpoint: string, payload: any[]): Promise<any> {
    console.log(`[WooBatchApi] Initiating chunked batch processing for ${payload.length} records on ${endpoint}...`);
    
    // Chunking logic to prevent PHP timeouts
    const chunkSize = 100;
    for (let i = 0; i < payload.length; i += chunkSize) {
      const chunk = payload.slice(i, i + chunkSize);
      console.log(`[WooBatchApi] Sending chunk ${Math.floor(i/chunkSize) + 1} (${chunk.length} items)...`);
      // Simulating HTTP request delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }

    return { status: 'SUCCESS_BATCH' };
  }
}
