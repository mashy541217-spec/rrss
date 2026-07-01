import React, { useState } from 'react';
import { useBetaStore } from '../store/useBetaStore';
import { Mail, Send, XCircle, Clock } from 'lucide-react';

export const BetaInvitations: React.FC = () => {
  const { invitations, inviteTester, revokeInvitation } = useBetaStore();
  
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      inviteTester(email, notes);
      setEmail('');
      setNotes('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
            <Mail size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Beta Invitations</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage access to the private beta program.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Invite Form */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} /> Send Invitation
          </h3>
          <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="glass-input" 
                placeholder="tester@company.com" 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Tester Notes (Optional)</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="glass-input" 
                placeholder="e.g. CEO of Enterprise Client" 
                rows={3} 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Send Beta Invite</button>
          </form>
        </div>

        {/* Invitations List */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0' }}>Sent Invitations</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Notes</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Sent At</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 500, fontSize: '14px' }}>{inv.email}</td>
                    <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{inv.notes || '-'}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: 
                          inv.status === 'Accepted' ? 'rgba(16, 185, 129, 0.1)' : 
                          inv.status === 'Sent' ? 'rgba(59, 130, 246, 0.1)' : 
                          'rgba(239, 68, 68, 0.1)',
                        color: 
                          inv.status === 'Accepted' ? 'var(--color-success)' : 
                          inv.status === 'Sent' ? '#3b82f6' : 
                          'var(--color-danger)'
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {new Date(inv.sentAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      {inv.status === 'Sent' && (
                        <button 
                          onClick={() => revokeInvitation(inv.id)} 
                          title="Revoke Invitation" 
                          style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                        >
                          <XCircle size={14} /> Revoke
                        </button>
                      )}
                      {inv.status === 'Revoked' && (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}><Clock size={12} /> Expired</span>
                      )}
                    </td>
                  </tr>
                ))}
                {invitations.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No beta invitations sent yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};
