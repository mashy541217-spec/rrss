import { Content } from '../aggregate/Content';
import { LanguageCode } from '../value-objects/LanguageCode';

export class LocalizationPolicy {
  /**
   * Enforces localization rules. E.g., require specific languages before publishing.
   */
  public requiresLocalization(content: Content, requiredLanguages: LanguageCode[]): string[] {
    return requiredLanguages
      .filter(lang => !content.getLocalization(lang))
      .map(lang => lang.value);
  }

  public isLocalizationComplete(content: Content, targetLanguages: LanguageCode[]): boolean {
    return targetLanguages.every(lang => {
      const loc = content.getLocalization(lang);
      return loc?.isComplete ?? false;
    });
  }
}
