export interface ICRMQuery {
  entityType: string;
  filters: Array<{ field: string; operator: string; value: any }>;
  limit?: number;
  offset?: number;

  where(field: string, operator: string, value: any): this;
  setLimit(limit: number): this;
}

export class CRMQueryBuilder implements ICRMQuery {
  entityType: string;
  filters: Array<{ field: string; operator: string; value: any }> = [];
  limit?: number;
  offset?: number;

  constructor(entityType: string) {
    this.entityType = entityType;
  }

  where(field: string, operator: string, value: any): this {
    this.filters.push({ field, operator, value });
    return this;
  }

  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }
}
