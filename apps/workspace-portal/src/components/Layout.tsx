import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { CustomerDashboard } from './CustomerDashboard';
import { BusinessManager } from './BusinessManager';
import { AICustomerAssistant } from './AICustomerAssistant';
import { SocialConnectionCenter } from './SocialConnectionCenter';
import { CommandPalette } from './CommandPalette';
import { 
  LayoutDashboard, Share2, Briefcase, Play, Calendar, FolderOpen, 
  BarChart3, Bot, ShoppingBag, FileText, Settings, Sparkles, Bell, 
  AlertTriangle, Languages, Sun, Moon, Search 
} from 'lucide-react';

export const Layout: React.FC = () => {
  const {
    activeModule, setActiveModule, workspaceName, timezone,
    notifications, clearNotification, language, setLanguage, theme, setTheme, brandColor, setBrandColor, t
  } = useWorkspaceStore();

  const navigationItems = [
    { id: 'dashboard', name: t.navigation.home, icon: <LayoutDashboard size={18} /> },
    { id: 'social', name: t.navigation.social, icon: <Share2 size={18} /> },
    { id: 'businesses', name: t.navigation.businesses, icon: <Briefcase size={18} /> },
    { id: 'automation', name: t.navigation.automation, icon: <Play size={18} /> },
    { id: 'calendar', name: t.navigation.calendar, icon: <Calendar size={18} /> },
    { id: 'media', name: t.navigation.media, icon: <FolderOpen size={18} /> },
    { id: 'analytics', name: t.navigation.analytics, icon: <BarChart3 size={18} /> },
    { id: 'assistant', name: t.navigation.assistant, icon: <Bot size={18} /> },
    { id: 'marketplace', name: t.navigation.marketplace, icon: <ShoppingBag size={18} /> },
    { id: 'reports', name: t.navigation.reports, icon: <FileText size={18} /> },
    { id: 'settings', name: t.navigation.settings, icon: <Settings size={18} /> }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <CustomerDashboard />;
      case 'social':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{t.navigation.social}</h2>
            <SocialConnectionCenter />
          </div>
        );
      case 'businesses':
        return <BusinessManager />;
      case 'assistant':
        return <AICustomerAssistant />;
      case 'automation':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <h2>{t.navigation.automation}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
                Design multi-channel content workflows and auto-publish content profiles visually.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>Instagram Auto-Publisher</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Trigger: On local DAM story updates</p>
                <div style={{ marginTop: '12px', color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>Active & Monitoring</div>
              </div>
              <div className="glass-card" style={{ padding: '20px', opacity: 0.6 }}>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>Multi-Channel Blast</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Trigger: Scheduled queue triggers</p>
                <div style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '12px' }}>Template Default</div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2>{t.navigation.calendar}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Visual scheduler for multi-network digital assets campaigns.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '20px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ fontWeight: 600, textAlign: 'center', fontSize: '12px', color: 'var(--color-primary)' }}>{day}</div>
              ))}
              {Array.from({ length: 28 }).map((_, idx) => (
                <div key={idx} style={{ minHeight: '80px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{idx + 1}</span>
                  {idx === 4 && (
                    <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid var(--color-primary)', borderRadius: '4px', padding: '2px 4px', fontSize: '10px', color: '#fff', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📸 Post: Promo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2>{t.navigation.media}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Upload and manage images, video feeds, reels, stories, templates, and dynamic assets.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <span style={{ fontSize: '40px' }}>📁</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Summer Campaign</span>
              </div>
              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <span style={{ fontSize: '40px' }}>📁</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Brand Templates</span>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <h2>{t.navigation.analytics}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
                Customer ROI statistics, time saved, and automated publishing conversion rates.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Publish Success Rate</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: 'var(--color-success)' }}>98.4%</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Engagement</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>12.8k</div>
              </div>
            </div>
          </div>
        );
      case 'marketplace':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2>{t.navigation.marketplace}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Discover integration plugins, custom automation triggers, prompt guidelines, and white label assets.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {['SAP Integration', 'Salesforce CRM Sync', 'WooCommerce Auto-Blast', 'DealerNet API Bridge'].map(name => (
                <div className="glass-card" key={name} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Certified Provider</div>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px', marginTop: '10px' }}>Install</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2>{t.navigation.reports}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Generate, program, and export PDF customer operations metrics directly to email channels.
            </p>
            <button className="btn-primary" style={{ marginTop: '16px' }}>Generate PDF Report</button>
          </div>
        );
      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2>{t.settings.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
                White Label and environment personalization dashboard settings.
              </p>
            </div>

            {/* Language Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.settings.langLabel}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setLanguage('en')}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
                    background: language === 'en' ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    color: '#fff', fontWeight: 600
                  }}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('es')}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
                    background: language === 'es' ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    color: '#fff', fontWeight: 600
                  }}
                >
                  Español
                </button>
              </div>
            </div>

            {/* Theme selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.settings.themeLabel}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setTheme('dark')}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
                    background: theme === 'dark' ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Moon size={14} /> Dark Mode
                </button>
                <button 
                  onClick={() => setTheme('light')}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
                    background: theme === 'light' ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    color: theme === 'light' ? '#fff' : 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Sun size={14} /> Light Mode
                </button>
              </div>
            </div>

            {/* Brand primary color customizer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.settings.colorLabel}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrandColor(color)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                      border: brandColor === color ? '3px solid #fff' : '1px solid var(--color-border)',
                      boxShadow: brandColor === color ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
                <input 
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  style={{
                    width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return <CustomerDashboard />;
    }
  };

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
            <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 600 }}>WORKSPACE OS</span>
          </div>
        </div>

        {/* Tenant selection details panel */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.navigation.activeWorkspace}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
            {workspaceName || 'Default Workspace'}
          </div>
        </div>

        {/* Dynamic navigation links */}
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navigationItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: '8px',
                  background: isActive ? 'rgba(var(--color-primary), 0.12)' : 'transparent',
                  backgroundColor: isActive ? 'var(--glass-glow)' : 'transparent',
                  border: isActive ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                  borderColor: isActive ? 'var(--color-primary)' : 'transparent',
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
            CO
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{t.navigation.role}</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{language.toUpperCase()} | {timezone}</div>
          </div>
        </div>

      </div>

      {/* Main content display window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Top Navbar */}
        <div className="glass-panel" style={{ height: 'var(--topbar-height)', width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--color-border)', zIndex: 900 }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            Workspace / {workspaceName || 'Default'} / <span style={{ color: 'var(--color-primary)' }}>{navigationItems.find(n => n.id === activeModule)?.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Command Palette Trigger */}
            <button 
              onClick={() => {
                const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
                window.dispatchEvent(event);
              }}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)',
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-muted)',
                fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Search size={14} />
              <span>Search Command...</span>
              <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 4px', borderRadius: '4px', fontSize: '9px' }}>Ctrl K</kbd>
            </button>

            {/* Language Switcher Quick Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px'
              }}
              title="Switch Language"
            >
              <Languages size={18} />
              <span style={{ fontWeight: 600 }}>{language.toUpperCase()}</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

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
                background: 'var(--glass-glow)', border: '1px solid var(--color-primary)',
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', color: '#fff',
                fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 2px 8px var(--glass-glow)'
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
              {t.navigation.assistant}
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

          {renderModuleContent()}

        </div>

      </div>

      {/* Render global Command Palette */}
      <CommandPalette />
    </div>
  );
};
