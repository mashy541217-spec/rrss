import { ICRMQuery } from '@rrss-auto/crm-sdk/dist/core/ICRMQuery';

export class SoqlTranspiler {
  transpile(query: ICRMQuery): string {
    const fields = 'Id, Name'; // In reality, this would use the MetadataCache to grab all fields
    
    let whereClause = '';
    if (query.filters && query.filters.length > 0) {
      whereClause = ' WHERE ' + query.filters.map(f => {
        const val = typeof f.value === 'string' ? `'${f.value}'` : f.value;
        return `${f.field} ${f.operator} ${val}`;
      }).join(' AND ');
    }

    const limitClause = query.limit ? ` LIMIT ${query.limit}` : '';
    
    const soql = `SELECT ${fields} FROM ${query.entityType}${whereClause}${limitClause}`;
    console.log(`[SoqlTranspiler] Transpiled ICRMQuery to SOQL: ${soql}`);
    return soql;
  }
}
