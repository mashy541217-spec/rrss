import { CrmRecord } from '../entities/CrmRecord';
import { ICRMQuery } from './ICRMQuery';

export interface ICRMSession {
  sessionId: string;
  
  ping(): Promise<boolean>;
  
  create(entityType: string, record: Partial<CrmRecord>): Promise<CrmRecord>;
  read(entityType: string, id: string): Promise<CrmRecord | null>;
  update(entityType: string, id: string, record: Partial<CrmRecord>): Promise<CrmRecord>;
  delete(entityType: string, id: string): Promise<boolean>;
  
  query(q: ICRMQuery): Promise<CrmRecord[]>;
  
  close(): Promise<void>;
}
