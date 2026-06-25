import { FakeBrowserProvider } from '../testing/FakeBrowserProvider';
import { FakeBrowserPage } from '../testing/FakeBrowserPage';

describe('Browser SDK Foundation', () => {
  it('should support chainable locators', async () => {
    const provider = new FakeBrowserProvider();
    const instance = await provider.launch();
    const context = await instance.newContext();
    const page = await context.newPage() as FakeBrowserPage;

    await page.goto('https://example.com');
    
    // Chainable async locator usage (similar to playwright)
    await page.locator('#login-form').locator('input[name="username"]').fill('admin');
    await page.locator('#login-form').locator('input[name="password"]').fill('secret');
    await page.locator('#login-form').locator('button[type="submit"]').click();

    expect(page.actionHistory).toEqual([
      'goto:https://example.com',
      'fill:#login-form >> input[name="username"]:admin',
      'fill:#login-form >> input[name="password"]:secret',
      'click:#login-form >> button[type="submit"]'
    ]);
  });
});
