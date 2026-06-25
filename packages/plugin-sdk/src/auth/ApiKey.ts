export interface ApiKeyConfiguration {
  readonly type: 'ApiKey';
  readonly key: string;
  readonly value: string;
  readonly addTo: 'header' | 'query' | 'body';
}
