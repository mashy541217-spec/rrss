import { Organization } from '../entities/Organization';
import { ApiKey } from '../entities/ApiKey';
import { AuditLog } from '../entities/AuditLog';
import { License } from '../entities/License';

export interface IEnterpriseRepository {
  // Organizations
  saveOrganization(org: Organization): Promise<void>;
  getOrganizationById(id: string): Promise<Organization | null>;
  
  // API Keys
  saveApiKey(key: ApiKey): Promise<void>;
  getApiKeyByHash(hash: string): Promise<ApiKey | null>;
  listApiKeys(organizationId: string, workspaceId?: string): Promise<ApiKey[]>;
  
  // Audit Logs
  appendAuditLog(log: AuditLog): Promise<void>;
  listAuditLogs(organizationId: string, limit?: number, offset?: number): Promise<AuditLog[]>;

  // Licenses (for on-prem/airgapped)
  saveLicense(license: License): Promise<void>;
  getLicenseForOrg(organizationId: string): Promise<License | null>;
}
