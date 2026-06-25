import { Specification } from '@rrss-auto/domain';
import { Asset } from '../aggregate/Asset';
import { MediaStatus } from '../enums/MediaStatus';

export class MediaCompatibleSpecification extends Specification<Asset> {
  public isSatisfiedBy(asset: Asset): boolean {
    return !asset.isDeleted && asset.status === MediaStatus.READY;
  }
}
