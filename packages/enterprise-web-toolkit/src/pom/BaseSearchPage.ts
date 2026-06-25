import { BasePage } from './BasePage';
import { RecordNotFoundException } from '../domain/EnterpriseExceptions';

export interface BaseSearchSelectors {
  searchInput: string;
  submitButton: string;
  noResultsMessage?: string;
  firstResultRow?: string;
}

export abstract class BaseSearchPage extends BasePage {
  protected abstract get searchSelectors(): BaseSearchSelectors;

  async waitForLoad(): Promise<void> {
    const isVisible = await this.getLocator(this.searchSelectors.searchInput).isVisible({ timeoutMs: 5000 }).catch(() => false);
    if (!isVisible) throw new Error('BaseSearchPage failed to load');
  }

  async search(query: string): Promise<void> {
    await this.getLocator(this.searchSelectors.searchInput).type(query);
    await this.getLocator(this.searchSelectors.submitButton).click();

    if (this.searchSelectors.noResultsMessage) {
      const notFound = await this.getLocator(this.searchSelectors.noResultsMessage).isVisible({ timeoutMs: 3000 }).catch(() => false);
      if (notFound) {
        throw new RecordNotFoundException(query);
      }
    }
  }

  async openFirstResult(): Promise<void> {
    if (!this.searchSelectors.firstResultRow) throw new Error('First result selector not configured');
    await this.getLocator(this.searchSelectors.firstResultRow).click();
  }
}
