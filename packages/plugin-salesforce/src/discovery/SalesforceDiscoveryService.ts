export class MetadataCacheManager {
  private cache: Map<string, any> = new Map();

  set(key: string, data: any) {
    this.cache.set(key, data);
    console.log(`[MetadataCache] Cached schema for ${key}`);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }
}

export class SalesforceDiscoveryService {
  constructor(private cacheManager: MetadataCacheManager) {}

  async discoverObjectSchema(objectName: string): Promise<any> {
    if (this.cacheManager.has(objectName)) {
      return this.cacheManager.get(objectName);
    }

    console.log(`[SalesforceDiscovery] Fetching metadata for ${objectName} from /services/data/v60.0/sobjects/${objectName}/describe...`);
    const mockSchema = {
      name: objectName,
      fields: ['Id', 'Name', 'Custom_Status__c'],
      relationships: []
    };

    this.cacheManager.set(objectName, mockSchema);
    return mockSchema;
  }
}
