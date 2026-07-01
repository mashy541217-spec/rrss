import React from 'react';
import { ShieldAlert, X, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const UpgradeDialog: React.FC = () => {
  const { upgradeDialogOpen, upgradeDialogReason, closeUpgradeDialog } = useSubscriptionStore();
  const { setActiveModule } = useWorkspaceStore();

  if (!upgradeDialogOpen) return null;

  const handleUpgradeClick = () => {
    closeUpgradeDialog();
    setActiveModule('settings'); // We'll route them to the Billing & Subscription page inside settings
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        borderRadius: '24px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
      }}>
        <button 
          onClick={closeUpgradeDialog}
          style={{
            position: 'absolute',
            top: '20px', right: '20px',
            background: 'none', border: 'none', color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '56px', height: '56px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
          color: 'var(--color-primary)'
        }}>
          <ShieldAlert size={28} />
        </div>

        <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 700 }}>Plan Limit Reached</h2>
        
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
          {upgradeDialogReason}
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '24px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>Why Upgrade?</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.8' }}>
            <li>Higher limits for businesses, users, and storage.</li>
            <li>Unlock premium features like AI Copilot and Automations.</li>
            <li>Priority enterprise-level infrastructure.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={closeUpgradeDialog}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpgradeClick}
            className="btn-primary"
            style={{ flex: 1, padding: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Zap size={16} /> View Plans
          </button>
        </div>
      </div>
    </div>
  );
};
