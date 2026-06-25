import { BasePage } from '@rrss-auto/enterprise-web-toolkit';
import { BrowserPage } from '@rrss-auto/browser-sdk';
import { SessionExpiredException } from '../domain/DealerNetExceptions';

export class DashboardPage extends BasePage {
  constructor(page: BrowserPage) {
    super(page);
  }

  private readonly selectors = {
    userProfileMenu: '#user-profile-menu',
    customerSearchLink: 'a[href="/customers/search"]'
  };

  async waitForLoad(): Promise<void> {
    const isVisible = await this.getLocator(this.selectors.userProfileMenu).isVisible({ timeoutMs: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new SessionExpiredException();
    }
  }

  async navigateToCustomerSearch(): Promise<void> {
    await this.getLocator(this.selectors.customerSearchLink).click();
  }
}
