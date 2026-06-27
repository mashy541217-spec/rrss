import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { ShieldCheck, Bot, Clock, BarChart3, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { socialAccounts, businesses, t } = useWorkspaceStore();

  const connectedCount = socialAccounts.filter((a) => a.status === 'CONNECTED').length;

  const sampleCampaigns = [
    { name: 'Summer Viral Launch', budget: '$1,200', spend: '$420', status: 'Running' },
    { name: 'Black Friday Campaign', budget: '$5,000', spend: '$0', status: 'Scheduled' }
  ];

  const recentActivities = [
    { time: '10 mins ago', desc: 'Instagram account connected successfully with profile isolation proxy 192.168.10.12' },
    { time: '1 hour ago', desc: 'Campaign "Summer Viral Launch" configured with initial media assets' },
    { time: '4 hours ago', desc: 'Auto-Publisher workflow executed: published "product_showcase_01.jpg"' },
    { time: '1 day ago', desc: 'New business unit registered: Acme Sales Team' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Title */}
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{t.dashboard.title}</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>{t.dashboard.subtitle}</p>
      </div>

      {/* Visual Business Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Metric Card: Posts Published */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', minHeight: '120px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} style={{ color: 'var(--color-primary)' }} /> {t.dashboard.postsPublished}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>24</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <ArrowUpRight size={14} /> +12% this week
          </div>
        </div>

        {/* Metric Card: Success Rate */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', minHeight: '120px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} style={{ color: 'var(--color-success)' }} /> {t.dashboard.successRate}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>98.4%</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <ArrowUpRight size={14} /> Stable execution pools
          </div>
        </div>

        {/* Metric Card: Registered Businesses */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', minHeight: '120px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} style={{ color: 'var(--color-primary)' }} /> {t.dashboard.registeredBus}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{businesses.length}</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Partitions fully isolated
          </div>
        </div>

        {/* Metric Card: Estimated ROI */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', minHeight: '120px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BarChart3 size={12} style={{ color: 'var(--color-warning)' }} /> {t.dashboard.roi}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-success)' }}>+340%</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <ArrowUpRight size={14} /> Marketing optimization
          </div>
        </div>

        {/* Metric Card: Time Saved */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', minHeight: '120px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} style={{ color: 'var(--color-primary)' }} /> {t.dashboard.timeSaved}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>45 hrs</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '8px', fontWeight: 600 }}>
            Automations active
          </div>
        </div>

      </div>

      {/* Grid containing Active Channels + Campaigns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Connected Channels List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            {t.dashboard.connectedCount} ({connectedCount})
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
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>@{acc.username}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                      <span className="status-dot active" />
                      {t.dashboard.activeStatus}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      Profile Isolated
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

      {/* Recent Activity Timeline & AI Suggestions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Timeline activity list */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{t.dashboard.recentActivity}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '16px' }}>{t.dashboard.recentActivityDesc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid var(--color-border)', paddingLeft: '16px', marginLeft: '8px' }}>
            {recentActivities.map((act, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px',
                  borderRadius: '50%', background: 'var(--color-primary)', border: '2px solid var(--bg-primary)'
                }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{act.desc}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{act.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations panel */}
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(139,92,246,0.03)', borderColor: 'rgba(139,92,246,0.2)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '4px' }}>
            <Bot size={20} style={{ color: 'var(--color-primary)' }} /> {t.dashboard.aiSuggestions}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '16px' }}>{t.dashboard.aiSuggestionsDesc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>•</span>
              <span>Based on your risk profiles, connected accounts are fully isolated. You can safely trigger simultaneous campaigns.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>•</span>
              <span>To optimize engagement, try asking AI Copilot: <strong>"Schedule viral Reels publishing timeline for Acme Sales Team"</strong>.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
