import { BaseLoginPage, BaseLoginSelectors } from '@rrss-auto/enterprise-web-toolkit';
import { BrowserPage } from '@rrss-auto/browser-sdk';

export class LoginPage extends BaseLoginPage {
  constructor(page: BrowserPage) {
    super(page);
  }

  protected get loginSelectors(): BaseLoginSelectors {
    return {
      usernameInput: '#login-username',
      passwordInput: '#login-password',
      submitButton: '#btn-submit-login',
      errorBanner: '.alert-danger'
    };
  }
}
