import { BaseAuthenticationWorkflow } from '@rrss-auto/enterprise-web-toolkit';
import { BrowserPage } from '@rrss-auto/browser-sdk';
import { LoginPage } from '../pom/LoginPage';
import { DashboardPage } from '../pom/DashboardPage';

export class AuthenticationWorkflow extends BaseAuthenticationWorkflow {
  constructor(page: BrowserPage) {
    super(page);
  }

  protected get loginUrl(): string {
    return 'https://dealernet.internal.enterprise/login';
  }

  protected getLoginPage() {
    return new LoginPage(this.page);
  }

  protected getDashboardPage() {
    return new DashboardPage(this.page);
  }
}
