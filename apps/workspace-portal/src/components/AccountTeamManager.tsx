import React, { useState } from 'react';
import { useAccountStore } from '../store/useAccountStore';
import type { AccountTeamMember } from '../store/useAccountStore';
import { Users, UserPlus, Shield, Trash2, Ban } from 'lucide-react';

export const AccountTeamManager: React.FC = () => {
  const { team, inviteMember, suspendMember, removeMember, updateMemberRole } = useAccountStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AccountTeamMember['role']>('Member');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      inviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
      setIsInviteOpen(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Team & Roles</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage global organization members and access levels.</p>
          </div>
        </div>
        <button onClick={() => setIsInviteOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 600 }}>
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>Member</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Last Active</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{member.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{member.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <select 
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                    disabled={member.role === 'Owner'}
                    className="glass-input"
                    style={{ padding: '4px 8px', fontSize: '12px', border: 'none', background: 'rgba(255,255,255,0.05)' }}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    background: member.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : member.status === 'Suspended' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: member.status === 'Active' ? 'var(--color-success)' : member.status === 'Suspended' ? 'var(--color-danger)' : 'var(--color-warning)'
                  }}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {new Date(member.lastActive).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  {member.role !== 'Owner' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => suspendMember(member.id)} title="Suspend" style={{ background: 'transparent', border: 'none', color: 'var(--color-warning)', cursor: 'pointer' }}><Ban size={16} /></button>
                      <button onClick={() => removeMember(member.id)} title="Remove" style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleInvite} className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Invite Team Member</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Email Address</label>
                <input type="email" className="glass-input" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required autoFocus placeholder="colleague@example.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Global Role</label>
                <select className="glass-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)}>
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Member">Member (Limited Access)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsInviteOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Send Invite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
