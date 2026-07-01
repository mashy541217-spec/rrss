import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Briefcase, Link, Activity, Image as ImageIcon } from 'lucide-react';

export const AccountBusinessManager: React.FC = () => {
  const { businesses, socialAccounts, damAssets } = useWorkspaceStore();

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--color-warning)' }}>
          <Briefcase size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Business Overview</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>High-level metrics for all business units across your workspaces.</p>
        </div>
      </div>

      {businesses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
          No businesses found in the active workspace.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {businesses.map(bus => {
            const accounts = socialAccounts.filter(a => a.businessId === bus.id);
            const assets = damAssets.filter(a => a.businessId === bus.id);

            return (
              <div key={bus.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bus.brandColor || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700 }}>
                  {bus.name.charAt(0)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{bus.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{bus.category}</span>
                </div>

                <div style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      <Link size={14} /> Channels
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{accounts.length}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      <ImageIcon size={14} /> Media Assets
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{assets.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      <Activity size={14} /> Automations
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-success)' }}>Active</span>
                  </div>
                </div>

                <div style={{ paddingLeft: '24px', borderLeft: '1px solid var(--color-border)' }}>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>View Details</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
