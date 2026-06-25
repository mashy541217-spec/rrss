import { Asset } from '../aggregate/Asset';
import { AssetId } from '../value-objects/AssetId';

export interface IAssetRepository {
  save(asset: Asset): Promise<void>;
  findById(id: AssetId): Promise<Asset | null>;
  findByWorkspace(workspaceRef: string): Promise<Asset[]>;
  delete(id: AssetId): Promise<void>;
}
