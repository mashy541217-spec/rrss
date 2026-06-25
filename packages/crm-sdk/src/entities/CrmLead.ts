import { CrmRecord } from './CrmRecord';

export class CrmLead extends CrmRecord {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;

  constructor(data: Partial<CrmLead> = {}) {
    super(data.attributes);
    Object.assign(this, data);
  }
}
