import React from 'react';
import { useBetaStore } from '../store/useBetaStore';
import { Activity, Users, AlertTriangle, MessageSquare, TrendingUp, ShieldCheck } from 'lucide-react';

export const BetaDashboard: React.FC = () => {
  const { invitations, feedbacks, crashReports } = useBetaStore();

  const activeTesters = invitations.filter(i => i.status === 'Accepted').length;
  const pendingInvites = invitations.filter(i => i.status === 'Sent').length;
  const openBugs = feedbacks.filter(f => f.type === 'Bug Report' && f.status === 'Open').length;
  
  // Mock data for visual metrics
  const crashRate = '0.4%';
  const sessionLength = '18m 42s';
  const satisfaction = '4.8/5.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
              <Activity size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Beta Program Dashboard</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>High-level overview of beta testing performance, stability, and feedback.</p>
            </div>
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} /> Private Beta Active
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        
        {/* KPI Cards */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <Users size={16} /> Active Testers
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{activeTesters}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '8px' }}>+ {pendingInvites} pending invites</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <AlertTriangle size={16} /> Open Bug Reports
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{openBugs}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '8px' }}>{crashReports.length} recorded crashes</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <MessageSquare size={16} /> Total Feedback
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{feedbacks.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '8px' }}>Avg Rating: {satisfaction}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <TrendingUp size={16} /> App Stability (Crash Rate)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>{crashRate}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>Avg Session: {sessionLength}</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Feedback & Crashes */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0' }}>Latest Activity</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {feedbacks.slice(0, 3).map(fb => (
              <div key={fb.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: fb.type === 'Bug Report' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                      color: fb.type === 'Bug Report' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}>
                      {fb.type}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{fb.category}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{fb.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Requested Features */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0' }}>Top Requested Features</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'TikTok Demographics', votes: 142 },
              { title: 'White Label Reports', votes: 98 },
              { title: 'Custom CRM Fields', votes: 65 },
              { title: 'Slack Integration', votes: 44 }
            ].map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: idx === 3 ? 'none' : '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{feat.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                  <TrendingUp size={12} color="var(--color-primary)" /> {feat.votes}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
