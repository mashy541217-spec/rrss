export class MetadataCacheManager {
  // Keyed by WorkspaceID -> MCC ID -> Customer ID
  private caches: Map<string, Map<string, any>> = new Map();

  private getCacheKey(workspaceId: string, managerId: string, customerId: string): string {
    return `${workspaceId}::${managerId}::${customerId}`;
  }

  set(workspaceId: string, managerId: string, customerId: string, key: string, data: any) {
    const fullKey = this.getCacheKey(workspaceId, managerId, customerId);
    if (!this.caches.has(fullKey)) this.caches.set(fullKey, new Map());
    this.caches.get(fullKey)!.set(key, data);
    console.log(`[GoogleAdsCache] Cached ${key} for Customer ${customerId} (Manager: ${managerId}, Workspace: ${workspaceId})`);
  }

  get(workspaceId: string, managerId: string, customerId: string, key: string): any {
    const fullKey = this.getCacheKey(workspaceId, managerId, customerId);
    return this.caches.get(fullKey)?.get(key);
  }

  has(workspaceId: string, managerId: string, customerId: string, key: string): boolean {
    const fullKey = this.getCacheKey(workspaceId, managerId, customerId);
    return this.caches.has(fullKey) && this.caches.get(fullKey)!.has(key);
  }
}
