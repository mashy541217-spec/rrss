export class GaqlTranspiler {
  transpileReportQuery(entity: string, metrics: string[], startDate: Date, endDate: Date): string {
    const selectFields = [`${entity}.id`, `${entity}.name`, ...metrics.map(m => `metrics.${m}`)].join(', ');
    const gaql = `SELECT ${selectFields} FROM ${entity} WHERE segments.date BETWEEN '${this.formatDate(startDate)}' AND '${this.formatDate(endDate)}'`;
    console.log(`[GaqlTranspiler] Transpiled report request to GAQL: ${gaql}`);
    return gaql;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
