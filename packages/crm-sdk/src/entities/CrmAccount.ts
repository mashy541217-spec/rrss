import { CrmRecord } from './CrmRecord';

export class CrmAccount extends CrmRecord {
  name?: string;
  website?: string;
  industry?: string;
  annualRevenue?: number;

  constructor(data: Partial<CrmAccount> = {}) {
    super(data.attributes);
    Object.assign(this, data);
  }
}
