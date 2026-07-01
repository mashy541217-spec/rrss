import React from 'react';
import { useAccountStore } from '../store/useAccountStore';
import { 
  Building2, Server, Briefcase, Users, Shield, Settings, CreditCard, Menu 
} from 'lucide-react';
import { OrganizationProfile } from './OrganizationProfile';
import { WorkspaceManager } from './WorkspaceManager';
import { AccountBusinessManager } from './AccountBusinessManager';
import { AccountTeamManager } from './AccountTeamManager';
import { SecuritySettings } from './SecuritySettings';
import { UserPreferences } from './UserPreferences';
import { UsageDashboard } from './UsageDashboard';
import { UpgradeCenter } from './UpgradeCenter';

export const AccountCenter: React.FC = () => {
  const { activeAccountTab, setActiveAccountTab } = useAccountStore();

  const renderContent = () => {
    switch (activeAccountTab) {
      case 'organization': return <OrganizationProfile />;
      case 'workspaces': return <WorkspaceManager />;
      case 'businesses': return <AccountBusinessManager />;
      case 'team': return <AccountTeamManager />;
      case 'security': return <SecuritySettings />;
      case 'preferences': return <UserPreferences />;
      case 'billing': 
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <UsageDashboard />
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
            <UpgradeCenter />
          </div>
        );
      default: return <OrganizationProfile />;
    }
  };

  const tabs = [
    { id: 'organization', label: 'Organization Profile', icon: <Building2 size={16} /> },
    { id: 'workspaces', label: 'Workspaces', icon: <Server size={16} /> },
    { id: 'businesses', label: 'Businesses', icon: <Briefcase size={16} /> },
    { id: 'team', label: 'Team & Roles', icon: <Users size={16} /> },
    { id: 'security', label: 'Security & Access', icon: <Shield size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={16} /> },
    { id: 'billing', label: 'Billing & Subscriptions', icon: <CreditCard size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      
      {/* Account Sidebar */}
      <div className="glass-panel" style={{ 
        width: '280px', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid var(--color-border)', marginBottom: '12px' }}>
          <Menu size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Account Center</h2>
        </div>

        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveAccountTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px',
              borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
              background: activeAccountTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeAccountTab === tab.id ? '#fff' : 'var(--color-text-muted)',
              border: 'none', transition: 'all 0.2s ease', fontWeight: activeAccountTab === tab.id ? 600 : 400
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
        {renderContent()}
      </div>
    </div>
  );
};
