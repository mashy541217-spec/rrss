import { Specification } from '@rrss-auto/domain';
import { PublicationProfile } from '../aggregate/PublicationProfile';

export class PublicationProfileValidSpecification extends Specification<PublicationProfile> {
  public isSatisfiedBy(profile: PublicationProfile): boolean {
    return (
      !profile.isDeleted &&
      profile.name.trim().length > 0 &&
      profile.targets.length > 0
    );
  }
}
