import { PlaywrightBrowserProvider } from '../client/PlaywrightBrowserProvider';
import { PlaywrightPage } from '../client/PlaywrightPage';
import { PlaywrightLocator } from '../client/PlaywrightLocator';

describe('Playwright Engine Provider', () => {
  it('should route generic locators to Playwright native hooks in mock mode', async () => {
    const provider = new PlaywrightBrowserProvider();
    const instance = await provider.launch({ mock: true });
    const context = await instance.newContext();
    const page = await context.newPage() as PlaywrightPage;

    const locator = page.locator('#username') as PlaywrightLocator;
    
    // Simulate generic type command
    await locator.type('admin', { humanize: false }); // false so it runs instantly without massive delays in tests

    // Since we mocked playwright, we can check the internal history of doNativeType
    expect(locator.mockHistory.length).toBeGreaterThan(0);
    const lastAction = locator.mockHistory[locator.mockHistory.length - 1];
    expect(lastAction).toContain('nativeType:#username:admin');
  });

  it('should instantiate isolated contexts correctly', async () => {
    const provider = new PlaywrightBrowserProvider();
    const instance = await provider.launch({ mock: true });
    const context1 = await instance.newContext();
    const context2 = await instance.newContext();

    expect(context1).not.toBe(context2);
  });
});
