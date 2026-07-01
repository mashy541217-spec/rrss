import React from 'react';
import { useAccountStore } from '../store/useAccountStore';
import { Settings, Bell, Eye, Moon, Sun, Monitor, Languages, Save } from 'lucide-react';

export const UserPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useAccountStore();
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <Settings size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>User Preferences</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Customize your personal experience across the platform.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Appearance */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} /> Appearance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Theme Interface</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => updatePreferences({ theme: 'light' })}
                  style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: preferences.theme === 'light' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer' }}
                >
                  <Sun size={20} /> Light
                </button>
                <button 
                  onClick={() => updatePreferences({ theme: 'dark' })}
                  style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: preferences.theme === 'dark' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer' }}
                >
                  <Moon size={20} /> Dark
                </button>
                <button 
                  onClick={() => updatePreferences({ theme: 'system' })}
                  style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: preferences.theme === 'system' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer' }}
                >
                  <Monitor size={20} /> System
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Languages size={14} /> Personal Language</label>
              <select 
                value={preferences.language}
                onChange={(e) => updatePreferences({ language: e.target.value })}
                className="glass-input"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Accessibility Options</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.accessibilityHighContrast}
                  onChange={(e) => updatePreferences({ accessibilityHighContrast: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                High Contrast Mode
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.accessibilityReduceMotion}
                  onChange={(e) => updatePreferences({ accessibilityReduceMotion: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                Reduce Motion & Animations
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} /> Notification Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <input 
                type="checkbox" 
                checked={preferences.emailNotifications}
                onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Email Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Receive daily summaries, alerts, and billing invoices to your registered email address.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <input 
                type="checkbox" 
                checked={preferences.pushNotifications}
                onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>In-App Alerts</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Receive real-time push notifications inside the workspace for critical events and automation triggers.</div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', paddingTop: '20px' }}>
              {saved && <span style={{ color: 'var(--color-success)', fontSize: '13px', fontWeight: 600 }}>Preferences Saved!</span>}
              <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 600 }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};
