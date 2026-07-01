import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { useLimitEngine } from '../lib/LimitEngine';
import type { PlanFeatures } from '../store/useSubscriptionStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  fallbackType?: 'overlay' | 'hide' | 'replace';
  featureName?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallbackType = 'overlay', featureName }) => {
  const { hasFeature } = useLimitEngine();
  const { setActiveModule } = useWorkspaceStore();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallbackType === 'hide') {
    return null;
  }

  const upgradeContent = (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px', textAlign: 'center', height: '100%', minHeight: '300px'
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', color: 'var(--color-text-muted)'
      }}>
        <Lock size={28} />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
        {featureName || 'Premium Feature'} Locked
      </h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.6' }}>
        This feature is not included in your current plan. Upgrade to unlock powerful new capabilities for your workspace.
      </p>
      <button 
        onClick={() => setActiveModule('settings')} 
        className="btn-primary"
        style={{ padding: '12px 32px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Zap size={16} /> Upgrade Plan
      </button>
    </div>
  );

  if (fallbackType === 'replace') {
    return (
      <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        {upgradeContent}
      </div>
    );
  }

  // Overlay mode
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ filter: 'blur(8px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none', height: '100%' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(9, 13, 22, 0.6)',
        borderRadius: 'inherit', zIndex: 10
      }}>
        <div className="glass-panel" style={{ padding: '0', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          {upgradeContent}
        </div>
      </div>
    </div>
  );
};
