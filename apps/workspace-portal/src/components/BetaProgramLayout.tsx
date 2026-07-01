import React from 'react';
import { useBetaStore } from '../store/useBetaStore';
import { 
  Activity, Mail, ToggleRight, MessageSquare, FileText, HeartPulse, Menu 
} from 'lucide-react';
import { BetaDashboard } from './BetaDashboard';
import { BetaInvitations } from './BetaInvitations';
import { FeatureFlags } from './FeatureFlags';
import { FeedbackCenter } from './FeedbackCenter';
import { Changelog } from './Changelog';
import { ProductHealth } from './ProductHealth';

export const BetaProgramLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useBetaStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <BetaDashboard />;
      case 'invitations': return <BetaInvitations />;
      case 'featureFlags': return <FeatureFlags />;
      case 'feedback': return <FeedbackCenter />;
      case 'changelog': return <Changelog />;
      case 'health': return <ProductHealth />;
      default: return <BetaDashboard />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Beta Dashboard', icon: <Activity size={16} /> },
    { id: 'invitations', label: 'Invitations', icon: <Mail size={16} /> },
    { id: 'featureFlags', label: 'Feature Flags', icon: <ToggleRight size={16} /> },
    { id: 'feedback', label: 'Feedback Center', icon: <MessageSquare size={16} /> },
    { id: 'changelog', label: 'Changelog', icon: <FileText size={16} /> },
    { id: 'health', label: 'Product Health', icon: <HeartPulse size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      
      {/* Beta Sidebar */}
      <div className="glass-panel" style={{ 
        width: '280px', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid var(--color-border)', marginBottom: '12px' }}>
          <Menu size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Beta Program</h2>
        </div>

        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px',
              borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
              border: 'none', transition: 'all 0.2s ease', fontWeight: activeTab === tab.id ? 600 : 400
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>Internal Tool Access Only</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
        {renderContent()}
      </div>
    </div>
  );
};
