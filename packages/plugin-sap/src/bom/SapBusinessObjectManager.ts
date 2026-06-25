export class SapSalesOrder {
  constructor(
    public orderNumber: string,
    public customerId: string,
    public netValue: number,
    public currency: string,
    public items: Array<{ materialId: string, quantity: number }>
  ) {}
}

export class SapBusinessObjectManager {
  // Translates raw generic ERP Records into strongly typed SAP Business Objects
  static translateToSalesOrder(rawErpRecord: any): SapSalesOrder {
    return new SapSalesOrder(
      rawErpRecord.data.orderNumber || 'UNKNOWN',
      rawErpRecord.data.soldToParty,
      rawErpRecord.data.netValue,
      rawErpRecord.data.currency,
      rawErpRecord.data.items || []
    );
  }
}
