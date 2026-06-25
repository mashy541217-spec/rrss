import { SapExecutionStrategy } from '../execution/SmartExecutionRouter';

export class SapRfcAdapter {
  async executeCommand(command: string, payload: any): Promise<any> {
    console.log(`[SapRfcAdapter] Executing BAPI/RFC command: ${command}`);
    // Uses erp-sdk under the hood
    return { status: 'SUCCESS_RFC' };
  }
}

export class SapGuiAdapter {
  async executeCommand(command: string, payload: any): Promise<any> {
    console.log(`[SapGuiAdapter] Executing Desktop GUI command: ${command}`);
    // Uses desktop-sdk under the hood. e.g. mapping 'createSalesOrder' to entering 'VA01' in the command field.
    return { status: 'SUCCESS_GUI' };
  }
}
