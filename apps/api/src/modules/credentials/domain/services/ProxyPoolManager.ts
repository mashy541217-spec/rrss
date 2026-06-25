import { Injectable } from '@nestjs/common';

export interface ProxyHealthStatus {
  success: boolean;
  latencyMs: number;
  ip: string;
  country: string;
  provider: string;
}

@Injectable()
export class ProxyPoolManager {
  // Mock residential proxy pool
  private readonly proxyPool = [
    { ip: '185.220.101.4', country: 'US', provider: 'Residential-Luminati-US-East' },
    { ip: '194.32.14.21', country: 'CL', provider: 'Residential-Oxylabs-CL-Santiago' },
    { ip: '45.138.89.102', country: 'BR', provider: 'Residential-Smartproxy-BR-SaoPaulo' },
    { ip: '82.102.23.41', country: 'ES', provider: 'Residential-Soax-ES-Madrid' },
    { ip: '103.241.12.90', country: 'IN', provider: 'Residential-Luminati-IN-Mumbai' }
  ];

  /**
   * Performs validation on a proxy, simulating ping latency and IP geolocation.
   */
  public async validateProxy(proxyString: string): Promise<ProxyHealthStatus> {
    // Simulate real networking check delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (proxyString === 'DIRECT_CONNECTION') {
      return {
        success: true,
        latencyMs: 12,
        ip: '127.0.0.1',
        country: 'Local',
        provider: 'Direct Host Network'
      };
    }

    // Extract IP from proxy string (e.g. "192.168.10.12:3128" -> "192.168.10.12")
    const cleanAddress = proxyString.split('@').pop()?.split(':')[0] || '192.168.1.1';
    
    // Check if proxy string indicates failure simulation
    if (proxyString.includes('fail') || proxyString.includes('dead')) {
      return {
        success: false,
        latencyMs: 9999,
        ip: cleanAddress,
        country: 'Unknown',
        provider: 'Failed Route'
      };
    }

    // Pick a random country/provider match or mock one
    const randomPick = this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)];

    return {
      success: true,
      latencyMs: Math.floor(Math.random() * 120) + 40, // 40-160ms latency
      ip: cleanAddress.startsWith('192.168.') ? randomPick.ip : cleanAddress, // geolocate virtual IPs
      country: randomPick.country,
      provider: randomPick.provider
    };
  }

  /**
   * Rotates and assigns a healthy residential SOCKS5 proxy from the pool.
   */
  public async rotateProxy(currentProxy: string, workspaceId: string): Promise<string> {
    console.log(`[ProxyPool] Rotating proxy for workspace ${workspaceId}. Current: ${currentProxy}`);
    
    const candidates = this.proxyPool.filter(p => !currentProxy.includes(p.ip));
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    
    // Format as a residential proxy URL/string (with random port and credentials)
    const randomPort = Math.floor(Math.random() * 1000) + 10000;
    const proxyUser = `customer-${workspaceId.substring(0, 8)}`;
    const proxyPass = `pass-${Math.floor(Math.random() * 100000)}`;
    
    return `socks5://${proxyUser}:${proxyPass}@${selected.ip}:${randomPort}`;
  }

  /**
   * Retrieves a default residential proxy for a platform and country/timezone.
   */
  public getResidentialProxy(workspaceId: string, provider: string): string {
    const selected = this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)];
    const randomPort = Math.floor(Math.random() * 1000) + 10000;
    const proxyUser = `customer-${workspaceId.substring(0, 8)}`;
    const proxyPass = `pass-${Math.floor(Math.random() * 100000)}`;
    
    return `socks5://${proxyUser}:${proxyPass}@${selected.ip}:${randomPort}`;
  }
}
