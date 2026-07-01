import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Users, UserPlus, MoreVertical, Search, ShieldAlert, User, ShieldCheck } from 'lucide-react';

export const TeamManager: React.FC = () => {
  const { activeBusinessId, businesses, inviteTeamMember } = useWorkspaceStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');

  const business = businesses.find(b => b.id === activeBusinessId);
  const team = business?.team || [];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId || !inviteEmail) return;
    inviteTeamMember(activeBusinessId, {
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole
    });
    setInviteEmail('');
    setShowInvite(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <ShieldAlert size={14} color="var(--color-error)" />;
      case 'Editor': return <ShieldCheck size={14} color="var(--color-primary)" />;
      default: return <User size={14} color="var(--color-text-muted)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Team Management</h2>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Manage access and roles for this business.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowInvite(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="glass-input" 
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Member</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Last Activity</th>
                <th style={{ padding: '16px 24px', width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-row">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#fff' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', width: 'fit-content' }}>
                      {getRoleIcon(member.role)} {member.role}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                      background: member.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : member.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: member.status === 'Active' ? 'var(--color-success)' : member.status === 'Pending' ? 'var(--color-warning)' : 'var(--color-error)'
                    }}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {team.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', color: 'var(--color-text-muted)' }}>
              <Users size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No team members found.</p>
            </div>
          )}
        </div>
      </div>

      {showInvite && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Invite Team Member</h3>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="glass-input" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px' }} 
                  required 
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Role</label>
                <select 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                  className="glass-input" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--color-background-dark)', color: '#fff' }}
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Editor">Editor (Can create/publish)</option>
                  <option value="Viewer">Viewer (Read only)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowInvite(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .hover-row:hover {
          background: rgba(255,255,255,0.03) !important;
        }
      `}</style>
    </div>
  );
};
