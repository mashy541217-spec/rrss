import { SearchCampaignAdapter, PerformanceMaxAdapter, BatchApiAdapter } from '../adapters/GoogleAdsAdapters';

export class GoogleAdsApiRouter {
  private searchAdapter = new SearchCampaignAdapter();
  private pmaxAdapter = new PerformanceMaxAdapter();
  private batchAdapter = new BatchApiAdapter();

  async executeSmartStrategy(intent: string, payload: any): Promise<any> {
    if (Array.isArray(payload) && payload.length > 100) {
      console.log(`[GoogleAdsRouter] Massive import detected. Routing to MutateJobService (Batch).`);
      return await this.batchAdapter.execute(payload);
    }
    
    if (intent === 'CREATE_ECOMMERCE_CAMPAIGN' || intent === 'PERFORMANCE_MAX') {
      console.log(`[GoogleAdsRouter] Omnichannel/E-Commerce intent detected. Routing to Performance Max.`);
      return await this.pmaxAdapter.execute(intent, payload);
    }

    console.log(`[GoogleAdsRouter] Keyword intent detected. Routing to Standard Search Campaign.`);
    return await this.searchAdapter.execute(intent, payload);
  }
}
