import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { ShieldCheck, Bot } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { socialAccounts, businesses } = useWorkspaceStore();

  const connectedCount = socialAccounts.filter((a) => a.status === 'CONNECTED').length;

  const sampleCampaigns = [
    { name: 'Summer Viral Launch', budget: '$1,200', spend: '$420', status: 'Running' },
    { name: 'Black Friday Campaign', budget: '$5,000', spend: '$0', status: 'Scheduled' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Title */}
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Workspace Operations Overview</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Monitor your active marketing channels, secure credentials environments, and automated pipelines.</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
            Connected Channels
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {connectedCount} <span style={{ fontSize: '13px', color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
            Active Automations
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            1 <span style={{ fontSize: '13px', color: 'var(--color-primary)', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Running</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
            Registered Businesses
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {businesses.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
            Environment Security
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            100% <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Grid containing Active Channels + Campaigns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Connected Channels List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Social Channels & Isolation Profile
          </h3>
          {socialAccounts.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No channels connected yet. Go to Businesses or Assistant to link profiles.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socialAccounts.map((acc) => (
                <div key={acc.id} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {acc.provider.toLowerCase() === 'instagram' ? '📸' : acc.provider.toLowerCase() === 'facebook' ? '👥' : '🔑'}
                    </span>
                    <div>
                      <strong>{acc.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Proxy: {acc.proxy}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                      <span className="status-dot active" />
                      Connected
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      Profile Isolated (Score: {acc.isolationScore}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marketing Campaigns Overview */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Marketing Campaigns Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sampleCampaigns.map((camp) => (
              <div key={camp.name} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <strong>{camp.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Budget: {camp.budget} | Spent: {camp.spend}</div>
                </div>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '4px', height: 'fit-content',
                  background: camp.status === 'Running' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: camp.status === 'Running' ? 'var(--color-success)' : 'var(--color-warning)',
                  fontWeight: 600
                }}>
                  {camp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notification banner + AI Operations recommendations */}
      <div className="glass-card" style={{ padding: '24px', background: 'rgba(139,92,246,0.03)', borderColor: 'rgba(139,92,246,0.2)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: '12px' }}>
          <Bot size={16} style={{ color: 'var(--color-primary)' }} /> AI Copilot Workspace Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-primary)' }}>•</span>
            <span>Based on anti-detection criteria, the connected profiles are fully isolated on distinct proxies. You can safely launch multi-posting campaigns.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-primary)' }}>•</span>
            <span>You have not uploaded any media files to the Workspace media vault. Try asking the AI Assistant: <strong>"Generate content draft for Summer Launch campaign"</strong>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
