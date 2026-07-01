import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Play, Plus, Search, Calendar, Target, Sparkles, ChevronRight } from 'lucide-react';
import { CampaignBuilder } from './CampaignBuilder';
import { ContentCalendar } from './ContentCalendar';

type TabView = 'dashboard' | 'calendar' | 'builder';

export const CampaignDashboard: React.FC = () => {
  const { activeBusinessId, campaigns } = useWorkspaceStore();
  const [currentView, setCurrentView] = useState<TabView>('dashboard');

  const businessCampaigns = campaigns.filter(c => c.businessId === activeBusinessId);
  const activeCount = businessCampaigns.filter(c => c.status === 'Running' || c.status === 'Scheduled').length;

  if (currentView === 'builder') {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 9999, overflow: 'auto' }}>
        <CampaignBuilder onClose={() => setCurrentView('dashboard')} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{ 
              padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
              background: currentView === 'dashboard' ? 'var(--color-primary)' : 'transparent',
              color: currentView === 'dashboard' ? '#fff' : 'var(--color-text-muted)'
            }}
          >
            <Play size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Campaigns
          </button>
          <button 
            onClick={() => setCurrentView('calendar')}
            style={{ 
              padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
              background: currentView === 'calendar' ? 'var(--color-primary)' : 'transparent',
              color: currentView === 'calendar' ? '#fff' : 'var(--color-text-muted)'
            }}
          >
            <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Calendar
          </button>
        </div>
        
        {currentView === 'dashboard' && (
          <button className="btn-primary" onClick={() => setCurrentView('builder')}>
            <Plus size={14} /> New Campaign
          </button>
        )}
      </div>

      {currentView === 'calendar' ? (
        <ContentCalendar />
      ) : (
        <>
          {/* Dashboard Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '8px' }}>Total Campaigns</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{businessCampaigns.length}</div>
            </div>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '8px' }}>Active & Scheduled</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-success)' }}>{activeCount}</div>
            </div>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '8px' }}>Total Reach (Est)</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>0</div>
            </div>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>AI Recommendations</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Optimize your schedule</div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="glass-panel" style={{ flex: 1, padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>All Campaigns</h3>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="text" placeholder="Search campaigns..." className="glass-input" style={{ paddingLeft: '30px', fontSize: '13px' }} />
              </div>
            </div>

            {businessCampaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
                <Target size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p>No campaigns found.</p>
                <button className="btn-secondary" onClick={() => setCurrentView('builder')} style={{ marginTop: '12px' }}>
                  Create your first campaign
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {businessCampaigns.map(camp => (
                  <div key={camp.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: camp.color || 'var(--color-primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{camp.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          {camp.status} • {camp.assetIds?.length || 0} Assets • {camp.channels?.length || 0} Channels
                        </div>
                      </div>
                    </div>
                    <button className="btn-secondary" style={{ padding: '6px' }}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
