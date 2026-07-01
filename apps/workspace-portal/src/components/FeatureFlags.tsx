import React from 'react';
import { useBetaStore } from '../store/useBetaStore';
import { ToggleRight, AlertCircle, Percent, Users, Box, Play } from 'lucide-react';

export const FeatureFlags: React.FC = () => {
  const { featureFlags, toggleFeatureFlag } = useBetaStore();

  const getRolloutIcon = (strategy: string) => {
    switch(strategy) {
      case 'Percentage': return <Percent size={14} />;
      case 'Workspace': return <Box size={14} />;
      case 'Tester': return <Users size={14} />;
      default: return <Play size={14} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--color-warning)' }}>
            <ToggleRight size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Feature Flags</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage conditional rollouts for new modules and beta features.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Active Flags</h3>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>+ Create Flag</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {featureFlags.map(flag => (
            <div key={flag.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '12px' 
            }}>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '15px', color: '#fff' }}>{flag.key}</span>
                  <span style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600,
                    padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--color-text-muted)' 
                  }}>
                    {getRolloutIcon(flag.rolloutStrategy)} {flag.rolloutStrategy} {flag.rolloutValue && `(${flag.rolloutValue})`}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{flag.description}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: flag.state === 'Enabled' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    {flag.state.toUpperCase()}
                  </span>
                  <div 
                    onClick={() => toggleFeatureFlag(flag.id, flag.state === 'Enabled' ? 'Disabled' : 'Enabled')}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', position: 'relative',
                      background: flag.state === 'Enabled' ? 'var(--color-success)' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px',
                      left: flag.state === 'Enabled' ? '22px' : '2px', transition: 'left 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
          <AlertCircle size={20} color="var(--color-danger)" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--color-danger)' }}>Warning</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Disabling active feature flags may cause immediate UI regressions for testers in the target rollout group. Ensure database migrations are backwards compatible before toggling core features off.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
