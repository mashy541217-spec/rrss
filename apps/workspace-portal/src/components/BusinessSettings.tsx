import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Save, Building2, Palette, Globe, Bell } from 'lucide-react';

export const BusinessSettings: React.FC = () => {
  const { activeBusinessId, businesses, updateBusinessSettings, updateBusinessBrand } = useWorkspaceStore();
  const business = businesses.find(b => b.id === activeBusinessId);
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    brandColor: '#8b5cf6',
    language: 'English',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    address: '',
    fiscalId: '',
    notifications: true
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        brandColor: business.brandColor || '#8b5cf6',
        language: business.settings.language,
        timezone: business.settings.timezone,
        currency: business.settings.currency,
        dateFormat: business.settings.dateFormat,
        timeFormat: business.settings.timeFormat,
        address: business.settings.address,
        fiscalId: business.settings.fiscalId,
        notifications: business.settings.notifications
      });
    }
  }, [business]);

  const handleSave = () => {
    if (!activeBusinessId) return;
    updateBusinessBrand(activeBusinessId, { name: formData.name, brandColor: formData.brandColor });
    updateBusinessSettings(activeBusinessId, {
      language: formData.language,
      timezone: formData.timezone,
      currency: formData.currency,
      dateFormat: formData.dateFormat,
      timeFormat: formData.timeFormat,
      address: formData.address,
      fiscalId: formData.fiscalId,
      notifications: formData.notifications
    });
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Business Name</label>
              <input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="glass-input" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Fiscal ID / VAT</label>
              <input 
                value={formData.fiscalId} 
                onChange={e => setFormData({...formData, fiscalId: e.target.value})} 
                className="glass-input" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px' }} 
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Business Address</label>
              <textarea 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                className="glass-input" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }} 
              />
            </div>
          </div>
        );
      case 'brand':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Brand Primary Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="color"
                  value={formData.brandColor} 
                  onChange={e => setFormData({...formData, brandColor: e.target.value})} 
                  style={{ width: '48px', height: '48px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
                />
                <input 
                  value={formData.brandColor} 
                  onChange={e => setFormData({...formData, brandColor: e.target.value})} 
                  className="glass-input" 
                  style={{ width: '120px', padding: '12px', borderRadius: '8px' }} 
                />
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Brand Preview</label>
              <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: formData.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{formData.name || 'Your Business'}</div>
                  <div style={{ fontSize: '12px', color: formData.brandColor }}>Primary Brand Application</div>
                </div>
                <button style={{ marginLeft: 'auto', background: formData.brandColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}>
                  Brand Button
                </button>
              </div>
            </div>
          </div>
        );
      case 'localization':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Language</label>
              <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--color-background-dark)', color: '#fff' }}>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Timezone</label>
              <select value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--color-background-dark)', color: '#fff' }}>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/Madrid</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Currency</label>
              <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--color-background-dark)', color: '#fff' }}>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Date Format</label>
              <select value={formData.dateFormat} onChange={e => setFormData({...formData, dateFormat: e.target.value})} className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--color-background-dark)', color: '#fff' }}>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Global Email Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Receive summaries and alerts for this business.</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.notifications} onChange={e => setFormData({...formData, notifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
              </label>
            </div>
            
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Custom SMTP Configuration</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Configure your own email server for outgoing communications.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>SMTP Host</label>
                  <input placeholder="smtp.example.com" className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Port</label>
                  <input placeholder="587" className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Username</label>
                  <input placeholder="apikey" className="glass-input" style={{ width: '100%', padding: '12px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', height: '100%' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>Settings</h2>
        {[
          { id: 'general', label: 'General', icon: <Building2 size={16} /> },
          { id: 'brand', label: 'Brand & Assets', icon: <Palette size={16} /> },
          { id: 'localization', label: 'Localization', icon: <Globe size={16} /> },
          { id: 'notifications', label: 'Notifications & SMTP', icon: <Bell size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
              fontWeight: 500, fontSize: '14px', transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="glass-panel" style={{ flex: 1, borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h3>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Manage preferences for {formData.name}</div>
          </div>
          <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px' }}>
            {renderTab()}
          </div>
        </div>
      </div>
      
    </div>
  );
};
