import { CrmRecord } from './CrmRecord';

export class CrmOpportunity extends CrmRecord {
  name?: string;
  accountId?: string;
  amount?: number;
  stageName?: string;
  closeDate?: Date;

  constructor(data: Partial<CrmOpportunity> = {}) {
    super(data.attributes);
    Object.assign(this, data);
  }
}
