import React, { useState } from 'react';

import { 
  BarChart3, TrendingUp, Users, Target, Activity, Share2, 
  Sparkles, Download, Calendar, ArrowUpRight, ArrowDownRight, Workflow
} from 'lucide-react';

type AnalyticsView = 'overview' | 'campaigns' | 'automations' | 'channels' | 'ai';

export const AnalyticsCenter: React.FC = () => {
  const [currentView, setCurrentView] = useState<AnalyticsView>('overview');

  const StatCard = ({ title, value, trend, positive, icon }: any) => (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
        <span style={{ fontSize: '13px', fontWeight: 500 }}>{title}</span>
        {icon}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 600 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: positive ? 'var(--color-success)' : 'var(--color-error)' }}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend} vs last month</span>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard title="Total Reach" value="2.4M" trend="+12.5%" positive={true} icon={<Users size={16} />} />
        <StatCard title="Engagement Rate" value="4.2%" trend="+0.8%" positive={true} icon={<Activity size={16} />} />
        <StatCard title="Total Conversions" value="1,284" trend="-2.4%" positive={false} icon={<Target size={16} />} />
        <StatCard title="Est. Revenue ROI" value="$14,500" trend="+18.2%" positive={true} icon={<TrendingUp size={16} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Mock Chart Area */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Audience Growth</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px' }}>
            {[40, 45, 30, 60, 75, 50, 90, 85, 95, 100, 80, 110].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--color-primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
            ))}
          </div>
        </div>
        
        {/* Health */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Business Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Automation Success</span>
                <span>99.9%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                <div style={{ width: '99.9%', height: '100%', background: 'var(--color-success)', borderRadius: '3px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Campaign Completion</span>
                <span>85%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                <div style={{ width: '85%', height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Publishing Activity</span>
                <span>100%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--color-success)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)', marginBottom: '16px' }}>
          <Sparkles size={18} /> <h3 style={{ margin: 0 }}>Trend Detection</h3>
        </div>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          Based on recent engagement across all channels, short-form video content featuring "Behind the Scenes" tags is performing <strong>45% better</strong> than standard image carousels.
        </p>
        <button className="btn-primary" style={{ marginTop: '12px' }}>Generate Video Campaign</button>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)', marginBottom: '16px' }}>
          <Calendar size={18} /> <h3 style={{ margin: 0 }}>Schedule Optimization</h3>
        </div>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          Your audience is most active between <strong>6:00 PM and 8:00 PM</strong> on Thursdays and Fridays. We recommend shifting your scheduled automations to this window.
        </p>
        <button className="btn-secondary" style={{ marginTop: '12px' }}>Apply Schedule Shift</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
            { id: 'campaigns', label: 'Campaigns', icon: <Target size={14} /> },
            { id: 'automations', label: 'Automations', icon: <Workflow size={14} /> },
            { id: 'channels', label: 'Channels', icon: <Share2 size={14} /> },
            { id: 'ai', label: 'AI Insights', icon: <Sparkles size={14} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setCurrentView(tab.id as AnalyticsView)}
              style={{ 
                padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                background: currentView === tab.id ? 'var(--color-primary)' : 'transparent',
                color: currentView === tab.id ? '#fff' : 'var(--color-text-muted)'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={14} /> Export Report
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentView === 'overview' && renderOverview()}
        {currentView === 'ai' && renderAIInsights()}
        
        {/* Placeholder for other views */}
        {['campaigns', 'automations', 'channels'].includes(currentView) && (
          <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <BarChart3 size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>Detailed {currentView} metrics panel (Mockup state)</p>
          </div>
        )}
      </div>
    </div>
  );
};
