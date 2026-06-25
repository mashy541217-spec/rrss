import { RestApiAdapter, GraphqlApiAdapter, BulkOperationsAdapter } from '../adapters/ShopifyAdapters';

export class ShopifyApiRouter {
  private restAdapter = new RestApiAdapter();
  private graphqlAdapter = new GraphqlApiAdapter();
  private bulkAdapter = new BulkOperationsAdapter();

  async executeSmartStrategy(intent: string, payload: any): Promise<any> {
    if (intent === 'BULK_EXPORT') {
      console.log(`[ShopifyRouter] Massive export intent detected. Routing to Bulk Operations API.`);
      return await this.bulkAdapter.executeQuery(payload.query);
    }
    
    if (intent === 'COMPLEX_QUERY' || (payload.query && payload.query.includes('graphql'))) {
      console.log(`[ShopifyRouter] Nested relationship query detected. Routing to GraphQL API.`);
      return await this.graphqlAdapter.execute(payload.query, payload.variables);
    }

    console.log(`[ShopifyRouter] Basic CRUD detected. Routing to REST API.`);
    return await this.restAdapter.execute(payload.endpoint, payload.method, payload.data);
  }
}
