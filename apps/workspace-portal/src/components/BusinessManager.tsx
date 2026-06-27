import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import type { BusinessTab, TeamMember } from '../store/useWorkspaceStore';
import {
  Plus, FolderOpen, LayoutDashboard, Share2, Play, Users,
  Settings, HeartPulse, Bell, ShieldCheck, Palette
} from 'lucide-react';

export const BusinessManager: React.FC = () => {
  const {
    businesses, addBusiness, activeBusinessId, setActiveBusinessId,
    activeBusinessTab, setActiveBusinessTab, socialAccounts,
    businessTeam, addTeamMember, t
  } = useWorkspaceStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Marketing Agency');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  const activeBus = businesses.find(b => b.id === activeBusinessId) || businesses[0];

  useEffect(() => {
    if (activeBus && activeBusinessId !== activeBus.id) {
      setActiveBusinessId(activeBus.id);
    }
  }, [activeBus, activeBusinessId, setActiveBusinessId]);

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addBusiness(name, category);
    setName('');
    setShowAddModal(false);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeBus) return;
    
    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      avatarInitials: inviteEmail.substring(0, 2).toUpperCase()
    };
    addTeamMember(activeBus.id, newMember);
    setInviteEmail('');
  };

  const currentTeam = activeBus ? (businessTeam[activeBus.id] || []) : [];
  const activeAccounts = socialAccounts.filter(a => a.businessId === activeBus?.id);

  // Compute Health Score
  let healthScore = 0;
  if (activeAccounts.length > 0) healthScore += 25;
  healthScore += 25; // Mock active automation
  if (currentTeam.length >= 2) healthScore += 20;
  if (activeBus?.logoUrl) healthScore += 15;
  if (activeBus?.brandColor) healthScore += 15;
  if (healthScore === 50) healthScore = 65; // Boost mock

  const renderDashboard = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
      <div className="glass-card kpi-card" style={{ padding: '20px' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
          {t.business?.kpis?.followers || 'Followers'}
        </div>
        <div className="animate-count-up" style={{ fontSize: '28px', fontWeight: 700 }}>12.4k</div>
        <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '8px' }}>+5% this week</div>
      </div>
      <div className="glass-card kpi-card" style={{ padding: '20px' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
          {t.business?.kpis?.engagement || 'Engagement'}
        </div>
        <div className="animate-count-up" style={{ fontSize: '28px', fontWeight: 700 }}>4.8%</div>
        <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '8px' }}>+1.2% this week</div>
      </div>
      <div className="glass-card kpi-card" style={{ padding: '20px' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
          {t.business?.kpis?.posts || 'Posts'}
        </div>
        <div className="animate-count-up" style={{ fontSize: '28px', fontWeight: 700 }}>42</div>
        <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '8px' }}>Automated via AI</div>
      </div>
      <div className="glass-card kpi-card" style={{ padding: '20px' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
          {t.business?.kpis?.timeSaved || 'Time Saved'}
        </div>
        <div className="animate-count-up" style={{ fontSize: '28px', fontWeight: 700 }}>14 hrs</div>
        <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '8px' }}>This month</div>
      </div>
    </div>
  );

  const renderChannels = () => (
    <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ marginBottom: '16px' }}>{t.business?.tabs?.channels || 'Channels'}</h3>
      {activeAccounts.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No channels connected yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeAccounts.map(acc => (
            <div key={acc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '20px' }}>{acc.provider.toLowerCase() === 'instagram' ? '📸' : '👥'}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{acc.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>@{acc.username}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`status-dot ${acc.status === 'CONNECTED' ? 'connected-pulse' : 'warn'}`} />
                <span style={{ fontSize: '12px', color: acc.status === 'CONNECTED' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {acc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
      <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ marginBottom: '16px' }}>{t.business?.tabs?.team || 'Team'}</h3>
        {currentTeam.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No team members invited yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentTeam.map(member => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="team-avatar">{member.avatarInitials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{member.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{member.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="role-badge">{member.role}</span>
                  <span style={{ fontSize: '11px', color: member.status === 'Active' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px', height: 'fit-content' }}>
        <h4 style={{ marginBottom: '12px' }}>Invite Member</h4>
        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" placeholder="Email address" required className="glass-input" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <select className="glass-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            <option value="Owner">{t.business?.roles?.owner || 'Owner'}</option>
            <option value="Manager">{t.business?.roles?.manager || 'Manager'}</option>
            <option value="Marketing">{t.business?.roles?.marketing || 'Marketing'}</option>
            <option value="Content Creator">{t.business?.roles?.creator || 'Content Creator'}</option>
            <option value="Sales">{t.business?.roles?.sales || 'Sales'}</option>
            <option value="Support">{t.business?.roles?.support || 'Support'}</option>
            <option value="Analyst">{t.business?.roles?.analyst || 'Analyst'}</option>
            <option value="Viewer">{t.business?.roles?.viewer || 'Viewer'}</option>
            <option value="Guest">{t.business?.roles?.guest || 'Guest'}</option>
          </select>
          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Send Invite</button>
        </form>
      </div>
    </div>
  );

  const renderHealth = () => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (healthScore / 100) * circumference;
    
    return (
      <div className="glass-panel" style={{ borderRadius: '12px', padding: '30px', display: 'flex', gap: '40px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg className="health-ring" width="120" height="120">
            <circle cx="60" cy="60" r="40" fill="transparent" stroke="var(--glass-border)" strokeWidth="8" />
            <circle cx="60" cy="60" r="40" fill="transparent" stroke={healthScore > 75 ? 'var(--color-success)' : healthScore > 40 ? 'var(--color-warning)' : 'var(--color-danger)'} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 700 }}>{healthScore}</span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Score</span>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ marginBottom: '8px' }}>{t.business?.health?.score || 'Health Score'} Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <ShieldCheck size={16} color={activeAccounts.length > 0 ? "var(--color-success)" : "var(--color-text-muted)"} />
            <span style={{ color: activeAccounts.length > 0 ? '#fff' : 'var(--color-text-muted)' }}>{t.business?.health?.channels || 'Connected Channels'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <Play size={16} color="var(--color-success)" />
            <span>{t.business?.health?.automations || 'Active Automations'} (Active)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <Users size={16} color={currentTeam.length >= 2 ? "var(--color-success)" : "var(--color-warning)"} />
            <span style={{ color: currentTeam.length >= 2 ? '#fff' : 'var(--color-text-muted)' }}>{t.business?.health?.team || 'Team Members'} (Min 2)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <Palette size={16} color={activeBus?.brandColor ? "var(--color-success)" : "var(--color-warning)"} />
            <span style={{ color: activeBus?.brandColor ? '#fff' : 'var(--color-text-muted)' }}>{t.business?.health?.branding || 'Custom Branding'}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeBusinessTab) {
      case 'dashboard': return renderDashboard();
      case 'channels': return renderChannels();
      case 'team': return renderTeam();
      case 'health': return renderHealth();
      case 'campaigns':
      case 'media':
      case 'settings':
      case 'notifications':
        return (
          <div className="glass-panel" style={{ borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Module "{activeBusinessTab}" is active for <strong>{activeBus?.name}</strong> (UI coming in next sprint).
          </div>
        );
      default: return renderDashboard();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {!activeBus ? (
        <div className="glass-panel" style={{ borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No Business Units registered in this Workspace. Click to register one.
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ margin: '20px auto 0' }}>Register Business</button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="glass-panel" style={{ borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            {activeBus.brandColor && (
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: activeBus.brandColor, opacity: 0.15, filter: 'blur(50px)', borderRadius: '50%', transform: 'translate(50%, -50%)' }} />
            )}
            <div>
              <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>{activeBus.name}</h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                {activeBus.category} • {healthScore >= 75 ? 'Healthy' : 'Needs Optimization'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Settings size={14} /> Manage
              </button>
              <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Plus size={14} /> New Business
              </button>
            </div>
          </div>

          {/* Business Tab Bar */}
          <div className="business-tab-bar">
            {[
              { id: 'dashboard', label: t.business?.tabs?.dashboard || 'Dashboard', icon: <LayoutDashboard size={14} /> },
              { id: 'channels', label: t.business?.tabs?.channels || 'Channels', icon: <Share2 size={14} /> },
              { id: 'campaigns', label: t.business?.tabs?.campaigns || 'Campaigns', icon: <Play size={14} /> },
              { id: 'media', label: t.business?.tabs?.media || 'Media Center', icon: <FolderOpen size={14} /> },
              { id: 'team', label: t.business?.tabs?.team || 'Team', icon: <Users size={14} /> },
              { id: 'health', label: t.business?.tabs?.health || 'Health', icon: <HeartPulse size={14} /> },
              { id: 'notifications', label: t.business?.tabs?.notifications || 'Notifications', icon: <Bell size={14} /> },
              { id: 'settings', label: t.business?.tabs?.settings || 'Settings', icon: <Settings size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveBusinessTab(tab.id as BusinessTab)}
                className={`business-tab-btn ${activeBusinessTab === tab.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, animation: 'count-up 0.3s ease' }}>
            {renderContent()}
          </div>
        </>
      )}

      {/* Add Business Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          <form onSubmit={handleAddBusiness} className="glass-panel" style={{ width: '450px', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Register Business Unit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px' }}>Business Display Name</label>
              <input type="text" required className="glass-input" placeholder="e.g. Nike Agency Division" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Marketing Agency">Marketing Agency</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Corporate / Financial Services">Corporate / Financial Services</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Business</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
