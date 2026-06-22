import { ResourcePool } from '../aggregates/ResourcePool';
import { ResourceType } from '../value-objects/ResourceType';

export interface IResourcePoolRepository {
  save(pool: ResourcePool): Promise<void>;
  findByType(type: ResourceType): Promise<ResourcePool | null>;
  findAll(): Promise<ResourcePool[]>;
}
