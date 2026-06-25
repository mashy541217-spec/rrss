import { Specification } from '@rrss-auto/domain';
import { Content } from '../aggregate/Content';
import { LanguageCode } from '../value-objects/LanguageCode';
import { LocalizationStatus } from '../enums/LocalizationStatus';

export class LocalizationCompleteSpecification extends Specification<Content> {
  constructor(private readonly requiredLanguages: LanguageCode[]) {
    super();
  }

  public isSatisfiedBy(content: Content): boolean {
    return this.requiredLanguages.every(lang => {
      const loc = content.getLocalization(lang);
      return loc?.status === LocalizationStatus.COMPLETED;
    });
  }
}
