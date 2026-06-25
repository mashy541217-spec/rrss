import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { CustomerDashboard } from './CustomerDashboard';
import { BusinessManager } from './BusinessManager';
import { AICustomerAssistant } from './AICustomerAssistant';
import { LayoutDashboard, Briefcase, Bot, Sparkles, Bell, AlertTriangle } from 'lucide-react';

export const Layout: React.FC = () => {
  const {
    activeModule, setActiveModule, workspaceName, timezone, locale,
    notifications, clearNotification
  } = useWorkspaceStore();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'businesses', name: 'Businesses', icon: <Briefcase size={18} /> },
    { id: 'assistant', name: 'AI Copilot', icon: <Bot size={18} /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Side navigation bar */}
      <div className="glass-panel" style={{
        width: 'var(--sidebar-width)', height: '100%', display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--color-border)', flexShrink: 0
      }}>
        {/* Brand header */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '24px' }}>🌐</span>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800 }}>RRSS AUTO</h2>
            <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 600 }}>WORKSPACE PORTAL</span>
          </div>
        </div>

        {/* Tenant selection details panel */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Workspace</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
            {workspaceName || 'Mi Primer Workspace'}
          </div>
        </div>

        {/* Dynamic navigation links */}
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navigationItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: '8px',
                  background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                  cursor: 'pointer', color: isActive ? '#fff' : 'var(--color-text-muted)', textAlign: 'left',
                  fontFamily: 'inherit', fontWeight: isActive ? 600 : 400, transition: 'all 0.2s ease'
                }}
              >
                <span style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }}>{item.icon}</span>
                <span style={{ fontSize: '13px' }}>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* User profile footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
            C
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>Client Operator</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{locale} | {timezone}</div>
          </div>
        </div>

      </div>

      {/* Main content display window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Top Navbar */}
        <div className="glass-panel" style={{ height: 'var(--topbar-height)', width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--color-border)', zIndex: 900 }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            Workspace / {workspaceName} / <span style={{ color: 'var(--color-primary)' }}>{navigationItems.find(n => n.id === activeModule)?.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Alerts Bell */}
            <div style={{ position: 'relative' }}>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--color-danger)', borderRadius: '50%' }} />
                )}
              </button>
            </div>

            {/* AI Assistant Quick launch button */}
            <button
              onClick={() => setActiveModule('assistant')}
              style={{
                background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', color: '#fff',
                fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
              AI Copilot
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* Notifications Alerts banner stack */}
          {notifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {notifications.map((notif) => (
                <div key={notif.id} style={{
                  padding: '12px 16px', borderRadius: '8px',
                  background: notif.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : notif.type === 'info' ? 'rgba(139,92,246,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${notif.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : notif.type === 'info' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <AlertTriangle size={16} style={{ color: notif.type === 'success' ? 'var(--color-success)' : notif.type === 'info' ? 'var(--color-primary)' : 'var(--color-danger)' }} />
                    <span>{notif.message}</span>
                  </div>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeModule === 'dashboard' && <CustomerDashboard />}
          {activeModule === 'businesses' && <BusinessManager />}
          {activeModule === 'assistant' && <AICustomerAssistant />}

        </div>

      </div>

    </div>
  );
};
