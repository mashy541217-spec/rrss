import { Specification } from '@rrss-auto/domain';
import { Content } from '../aggregate/Content';
import { ContentStatus } from '../enums/ContentStatus';

export class ContentReadyForPublicationSpecification extends Specification<Content> {
  public isSatisfiedBy(content: Content): boolean {
    return (
      !content.isDeleted &&
      content.status === ContentStatus.READY &&
      (!!content.title || !!content.body)
    );
  }
}
