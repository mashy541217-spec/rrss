import { BaseSearchPage, BaseSearchSelectors } from '@rrss-auto/enterprise-web-toolkit';
import { BrowserPage } from '@rrss-auto/browser-sdk';

export class CustomerSearchPage extends BaseSearchPage {
  constructor(page: BrowserPage) {
    super(page);
  }

  protected get searchSelectors(): BaseSearchSelectors {
    return {
      searchInput: '#search-rut',
      submitButton: '#btn-search-customer',
      noResultsMessage: '.no-results-found',
      firstResultRow: '#customer-results-table tbody tr:first-child'
    };
  }
}
