import { FakeBrowserProvider, FakeBrowserPage } from '@rrss-auto/browser-sdk';
import { AuthenticationWorkflow } from '../workflows/AuthenticationWorkflow';
import { DealerNetPlugin } from '../plugin/DealerNetPlugin';

describe('DealerNet Plugin Workflows', () => {
  it('should execute AuthenticationWorkflow without physical browser', async () => {
    const provider = new FakeBrowserProvider();
    const instance = await provider.launch();
    const context = await instance.newContext();
    const page = await context.newPage() as FakeBrowserPage;

    const auth = new AuthenticationWorkflow(page);
    await auth.execute('admin', 'password123');

    // Verify it interacted with the abstract locators
    expect(page.actionHistory).toContain('goto:https://dealernet.internal.enterprise/login');
    expect(page.actionHistory.find(a => a.startsWith('type:#login-username:admin'))).toBeDefined();
    expect(page.actionHistory.find(a => a.startsWith('type:#login-password:password123'))).toBeDefined();
    expect(page.actionHistory.find(a => a.startsWith('click:#btn-submit-login'))).toBeDefined();
  });

  it('should run via Plugin SDK interface', async () => {
    const plugin = new DealerNetPlugin();
    const provider = new FakeBrowserProvider();

    const result = await plugin.executeAction('Login', {} as any, {} as any, {
      provider,
      mock: true,
      username: 'test',
      password: 'testpassword'
    });

    expect(result.success).toBe(true);
  });
});
