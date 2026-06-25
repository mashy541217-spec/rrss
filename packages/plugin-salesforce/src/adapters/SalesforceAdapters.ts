export class RestApiAdapter {
  async execute(operation: string, payload: any): Promise<any> {
    console.log(`[RestApiAdapter] Executing standard REST API for single record.`);
    return { status: 'SUCCESS_REST' };
  }
}

export class BulkApiAdapter {
  async execute(operation: string, payload: any[]): Promise<any> {
    console.log(`[BulkApiAdapter] Initiating Bulk API 2.0 job for ${payload.length} records.`);
    return { status: 'SUCCESS_BULK_JOB_CREATED' };
  }
}

export class CompositeApiAdapter {
  async execute(operations: any[]): Promise<any> {
    console.log(`[CompositeApiAdapter] Executing chained composite graph with ${operations.length} sub-requests.`);
    return { status: 'SUCCESS_COMPOSITE' };
  }
}
