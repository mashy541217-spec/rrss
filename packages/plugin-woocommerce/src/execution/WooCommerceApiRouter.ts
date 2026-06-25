import { RestApiAdapter, BatchApiAdapter } from '../adapters/WooCommerceAdapters';

export class WooCommerceApiRouter {
  private restAdapter = new RestApiAdapter();
  private batchAdapter = new BatchApiAdapter();

  async executeSmartStrategy(endpoint: string, method: string, payload: any): Promise<any> {
    if (Array.isArray(payload) && payload.length > 1) {
      // Use batch API for multiple items (e.g., massive inventory syncs)
      const batchEndpoint = endpoint.includes('batch') ? endpoint : `${endpoint}/batch`;
      return await this.batchAdapter.execute(batchEndpoint, payload);
    }

    // Default to standard REST
    return await this.restAdapter.execute(endpoint, method, payload);
  }
}
