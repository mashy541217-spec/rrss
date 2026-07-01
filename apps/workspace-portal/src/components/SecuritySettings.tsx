import React from 'react';
import { Shield, Key, Smartphone, AlertCircle, History } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--color-danger)' }}>
            <Shield size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Security & Access</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage authentication, API keys, and active sessions.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Password Management */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} /> Password & Authentication
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Current Password</label>
              <input type="password" placeholder="••••••••" className="glass-input" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>New Password</label>
              <input type="password" placeholder="Enter new password" className="glass-input" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className="glass-input" />
            </div>
            <button className="btn-primary" style={{ marginTop: '8px', alignSelf: 'flex-start' }}>Update Password</button>
          </div>
        </div>

        {/* 2FA (Placeholder) */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} /> Two-Factor Authentication
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              Add an extra layer of security to your organization. Require users to enter a one-time code from their mobile device when signing in.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: 'var(--color-warning)' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>2FA is currently disabled for this organization.</span>
            </div>
          </div>
          <button className="btn-secondary" style={{ marginTop: '24px', alignSelf: 'flex-start' }}>Enable 2FA (Coming Soon)</button>
        </div>

        {/* API Keys (Placeholder) */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} /> API Keys
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
            Manage programmatic access to your organization's resources. Keys should be kept secret.
          </p>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Production Key</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>sk_live_*******************</div>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Revoke</button>
          </div>
          <button className="btn-secondary" style={{ marginTop: '16px' }}>Generate New Key</button>
        </div>

        {/* Active Sessions */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} /> Active Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { os: 'Windows 11 • Chrome', ip: '192.168.1.1', location: 'New York, US', current: true },
              { os: 'iOS 17 • Safari', ip: '192.168.1.5', location: 'New York, US', current: false },
            ].map((session, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: i === 0 ? '1px solid var(--color-border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {session.os}
                    {session.current && <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: '12px' }}>Current</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {session.ip} • {session.location}
                  </div>
                </div>
                {!session.current && (
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '12px' }}>Revoke</button>
                )}
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: '16px', width: '100%' }}>Sign Out of All Other Devices</button>
        </div>

      </div>
    </div>
  );
};
