import { Specification } from '@rrss-auto/domain';
import { Publication } from '../entities/Publication';
import { PublicationStatus } from '../enums/PublicationStatus';

export class PublicationReadySpecification extends Specification<Publication> {
  public isSatisfiedBy(publication: Publication): boolean {
    return (
      publication.status.value === PublicationStatus.Draft &&
      !!publication.contentId
    );
  }
}