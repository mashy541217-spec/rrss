export class ShopifyMetadataCache {
  // Store isolation: caches are keyed by WorkspaceID -> ShopifyDomain
  private caches: Map<string, Map<string, any>> = new Map();

  private getStoreCache(workspaceId: string, shopifyDomain: string): Map<string, any> {
    const key = `${workspaceId}::${shopifyDomain}`;
    if (!this.caches.has(key)) {
      this.caches.set(key, new Map());
    }
    return this.caches.get(key)!;
  }

  set(workspaceId: string, shopifyDomain: string, key: string, data: any) {
    const cache = this.getStoreCache(workspaceId, shopifyDomain);
    cache.set(key, data);
    console.log(`[ShopifyCache] Cached metadata for ${key} at ${shopifyDomain} (Workspace: ${workspaceId})`);
  }

  get(workspaceId: string, shopifyDomain: string, key: string): any {
    return this.getStoreCache(workspaceId, shopifyDomain).get(key);
  }

  has(workspaceId: string, shopifyDomain: string, key: string): boolean {
    return this.getStoreCache(workspaceId, shopifyDomain).has(key);
  }

  clear(workspaceId: string, shopifyDomain: string) {
    this.getStoreCache(workspaceId, shopifyDomain).clear();
  }
}
