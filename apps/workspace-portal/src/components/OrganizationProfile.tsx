import React from 'react';
import { useAccountStore } from '../store/useAccountStore';
import { Building2, Save, Upload, MapPin, Globe, Phone, Mail } from 'lucide-react';

export const OrganizationProfile: React.FC = () => {
  const { profile, updateProfile } = useAccountStore();
  const [formData, setFormData] = React.useState(profile);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
          <Building2 size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Organization Profile</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage your company details and global settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Logo & Brand */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.05)',
            border: '2px dashed var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--color-text-muted)', gap: '8px'
          }}>
            <Upload size={24} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Upload Logo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Organization Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Primary Brand Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="color" name="brandColor" value={formData.brandColor} onChange={handleChange} style={{ width: '40px', height: '40px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} />
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{formData.brandColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* Contact Info */}
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Contact Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Contact Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} /> Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} className="glass-input" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Primary Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="glass-input" />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* Localization */}
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Regional Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Default Language</label>
            <select name="language" value={formData.language} onChange={handleChange} className="glass-input">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Timezone</label>
            <select name="timezone" value={formData.timezone} onChange={handleChange} className="glass-input">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Currency</label>
            <select name="currency" value={formData.currency} onChange={handleChange} className="glass-input">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
          {saved && <span style={{ color: 'var(--color-success)', alignSelf: 'center', fontSize: '14px', fontWeight: 600 }}>Profile Saved!</span>}
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: 600 }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
