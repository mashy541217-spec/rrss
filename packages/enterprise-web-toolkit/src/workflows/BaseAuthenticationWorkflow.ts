import { BrowserPage } from '@rrss-auto/browser-sdk';
import { BaseLoginPage } from '../pom/BaseLoginPage';
import { BasePage } from '../pom/BasePage';

export abstract class BaseAuthenticationWorkflow {
  constructor(protected readonly page: BrowserPage) {}

  protected abstract get loginUrl(): string;
  protected abstract getLoginPage(): BaseLoginPage;
  protected abstract getDashboardPage(): BasePage; // Page to verify login success

  public async execute(username: string, password: string): Promise<void> {
    await this.page.goto(this.loginUrl);

    const loginPage = this.getLoginPage();
    await loginPage.waitForLoad();
    await loginPage.login(username, password);

    const dashboardPage = this.getDashboardPage();
    await dashboardPage.waitForLoad();
  }
}
