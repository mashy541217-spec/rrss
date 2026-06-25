import { RestApiAdapter, BulkApiAdapter, CompositeApiAdapter } from '../adapters/SalesforceAdapters';

export enum SalesforceApiStrategy {
  REST = 'REST',
  BULK = 'BULK',
  COMPOSITE = 'COMPOSITE'
}

export class SalesforceApiRouter {
  private restAdapter = new RestApiAdapter();
  private bulkAdapter = new BulkApiAdapter();
  private compositeAdapter = new CompositeApiAdapter();

  async executeSmartStrategy(operation: string, payload: any): Promise<any> {
    if (Array.isArray(payload)) {
      if (payload.length > 200) {
        console.log(`[SalesforceRouter] Payload > 200. Routing to BULK API.`);
        return await this.bulkAdapter.execute(operation, payload);
      }
      
      // If it's a chained array of operations (e.g., Create Account -> Create Contact)
      if (payload.length > 1 && payload.some(p => p.referenceId)) {
        console.log(`[SalesforceRouter] Chained operations detected. Routing to COMPOSITE API.`);
        return await this.compositeAdapter.execute(payload);
      }
    }

    console.log(`[SalesforceRouter] Single record detected. Routing to REST API.`);
    return await this.restAdapter.execute(operation, payload);
  }
}
