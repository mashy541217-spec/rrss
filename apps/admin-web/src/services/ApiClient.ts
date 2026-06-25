// API Client for the Enterprise Control Center
const API_BASE_URL = 'http://localhost:3000';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (options.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }
    
    // Some endpoints return empty body or 204
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }
    
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[API Client Error] ${method} ${endpoint}:`, error);
    throw error;
  }
}
