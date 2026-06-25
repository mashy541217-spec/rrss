import { Injectable } from '@nestjs/common';

export interface ProvisioningStep {
  name: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  message?: string;
}

export interface ProvisioningChecklist {
  accountId: string;
  status: 'PENDING' | 'PROVISIONING' | 'COMPLETED' | 'FAILED';
  steps: ProvisioningStep[];
}

@Injectable()
export class ProvisioningStore {
  private readonly checklists = new Map<string, ProvisioningChecklist>();

  public get(accountId: string): ProvisioningChecklist | undefined {
    return this.checklists.get(accountId);
  }

  public set(accountId: string, checklist: ProvisioningChecklist): void {
    this.checklists.set(accountId, checklist);
  }

  public remove(accountId: string): void {
    this.checklists.delete(accountId);
  }
}
