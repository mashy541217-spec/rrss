export class WooCommerceMetadataCache {
  // Store isolation: caches are keyed by WorkspaceID -> StoreURL
  private caches: Map<string, Map<string, any>> = new Map();

  private getStoreCache(workspaceId: string, storeUrl: string): Map<string, any> {
    const key = `${workspaceId}::${storeUrl}`;
    if (!this.caches.has(key)) {
      this.caches.set(key, new Map());
    }
    return this.caches.get(key)!;
  }

  set(workspaceId: string, storeUrl: string, key: string, data: any) {
    const cache = this.getStoreCache(workspaceId, storeUrl);
    cache.set(key, data);
    console.log(`[WooCommerceCache] Cached metadata for ${key} at ${storeUrl} (Workspace: ${workspaceId})`);
  }

  get(workspaceId: string, storeUrl: string, key: string): any {
    return this.getStoreCache(workspaceId, storeUrl).get(key);
  }

  has(workspaceId: string, storeUrl: string, key: string): boolean {
    return this.getStoreCache(workspaceId, storeUrl).has(key);
  }

  clear(workspaceId: string, storeUrl: string) {
    this.getStoreCache(workspaceId, storeUrl).clear();
  }
}
