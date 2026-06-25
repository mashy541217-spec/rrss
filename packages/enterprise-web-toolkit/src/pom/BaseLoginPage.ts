import { BasePage } from './BasePage';
import { AuthenticationFailedException } from '../domain/EnterpriseExceptions';

export interface BaseLoginSelectors {
  usernameInput: string;
  passwordInput: string;
  submitButton: string;
  errorBanner?: string;
}

export abstract class BaseLoginPage extends BasePage {
  protected abstract get loginSelectors(): BaseLoginSelectors;

  async waitForLoad(): Promise<void> {
    const isVisible = await this.getLocator(this.loginSelectors.usernameInput).isVisible({ timeoutMs: 5000 }).catch(() => false);
    if (!isVisible) throw new Error('BaseLoginPage failed to load');
  }

  async login(username: string, password: string): Promise<void> {
    await this.getLocator(this.loginSelectors.usernameInput).type(username);
    await this.getLocator(this.loginSelectors.passwordInput).type(password);
    await this.getLocator(this.loginSelectors.submitButton).click();

    if (this.loginSelectors.errorBanner) {
      const isErrorVisible = await this.getLocator(this.loginSelectors.errorBanner).isVisible({ timeoutMs: 2000 }).catch(() => false);
      if (isErrorVisible) {
        throw new AuthenticationFailedException();
      }
    }
  }
}
