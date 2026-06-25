export class SearchCampaignAdapter {
  async execute(operation: string, payload: any): Promise<any> {
    console.log(`[SearchCampaignAdapter] Executing standard Search/Keyword operations via Google Ads API.`);
    return { status: 'SUCCESS_SEARCH' };
  }
}

export class PerformanceMaxAdapter {
  async execute(operation: string, payload: any): Promise<any> {
    console.log(`[PerformanceMaxAdapter] Mapping generic AdCreatives into PMax AssetGroups...`);
    console.log(`[PerformanceMaxAdapter] Uploading assets and linking to AssetGroup...`);
    return { status: 'SUCCESS_PMAX' };
  }
}

export class BatchApiAdapter {
  async execute(operations: any[]): Promise<any> {
    console.log(`[GoogleAdsBatchApi] Dispatching MutateJobService for ${operations.length} operations...`);
    return { status: 'SUCCESS_BATCH' };
  }
}
