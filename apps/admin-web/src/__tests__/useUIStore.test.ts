import { useUIStore } from '../store/useUIStore';

describe('useUIStore State Management Store', () => {
  beforeEach(() => {
    // Reset Zustand state logic or set default variables
    useUIStore.setState({
      theme: 'dark',
      sidebarCollapsed: false,
      activeModule: 'dashboard',
      notifications: []
    });
  });

  it('should initialize with default dark theme and expanded sidebar', () => {
    const state = useUIStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.activeModule).toBe('dashboard');
  });

  it('should toggle theme state successfully between dark and light', () => {
    const setAttributeMock = jest.fn();
    const mockDocument = {
      documentElement: {
        setAttribute: setAttributeMock
      }
    };
    
    // Save original global document if any, and mock it
    const originalDocument = (global as any).document;
    (global as any).document = mockDocument;

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
    expect(setAttributeMock).toHaveBeenCalledWith('data-theme', 'light');

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('dark');
    expect(setAttributeMock).toHaveBeenCalledWith('data-theme', 'dark');

    // Restore original document
    if (originalDocument) {
      (global as any).document = originalDocument;
    } else {
      delete (global as any).document;
    }
  });

  it('should update the active module route path', () => {
    useUIStore.getState().setActiveModule('workers');
    expect(useUIStore.getState().activeModule).toBe('workers');

    useUIStore.getState().setActiveModule('security');
    expect(useUIStore.getState().activeModule).toBe('security');
  });

  it('should manage custom notifications dynamically', () => {
    expect(useUIStore.getState().notifications.length).toBe(0);

    useUIStore.getState().addNotification('EKS cluster scaled up.', 'success');
    let currentNotifications = useUIStore.getState().notifications;
    expect(currentNotifications.length).toBe(1);
    expect(currentNotifications[0].message).toBe('EKS cluster scaled up.');
    expect(currentNotifications[0].type).toBe('success');

    const createdId = currentNotifications[0].id;
    useUIStore.getState().clearNotification(createdId);
    expect(useUIStore.getState().notifications.length).toBe(0);
  });
});
