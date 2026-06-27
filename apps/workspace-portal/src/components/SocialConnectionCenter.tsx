import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { ShieldAlert, LogIn, ExternalLink, ShieldCheck, Key } from 'lucide-react';

interface ProviderCard {
  id: string;
  name: string;
  type: 'oauth' | 'credentials';
  icon: string;
  desc: string;
}

export const SocialConnectionCenter: React.FC = () => {
  const { socialAccounts, connectOAuthAccount, connectNonOAuthAccount, activeProvisioning, clearActiveProvisioning, businessTemplate } = useWorkspaceStore();
  
  const [selectedProvider, setSelectedProvider] = useState<ProviderCard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accountName, setAccountName] = useState('');
  
  // Credentials-based form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customMetadata, setCustomMetadata] = useState('');

  // OAuth Simulator state
  const [oauthStep, setOauthStep] = useState<'start' | 'loading' | 'success'>('start');

  const providers: ProviderCard[] = [
    { id: 'instagram', name: 'Instagram Business', type: 'oauth', icon: '📸', desc: 'Auto-publish reels, feeds, stories and replies.' },
    { id: 'facebook', name: 'Facebook Pages', type: 'oauth', icon: '👥', desc: 'Sync timelines, group sharing, and meta ad metrics.' },
    { id: 'threads', name: 'Threads App', type: 'oauth', icon: '🧵', desc: 'Integrate post shares and user communications.' },
    { id: 'whatsapp', name: 'WhatsApp Business', type: 'oauth', icon: '💬', desc: 'Manage messaging APIs, template queues, and bots.' },
    { id: 'telegram', name: 'Telegram Channels', type: 'oauth', icon: '✈️', desc: 'Broadcasting integrations and message logs.' },
    { id: 'tiktok', name: 'TikTok Creator', type: 'oauth', icon: '🎵', desc: 'Publish video campaigns and sync trends.' },
    { id: 'google_business', name: 'Google Business Profile', type: 'oauth', icon: '📍', desc: 'Update maps listings, hours, and review replies.' },
    { id: 'google_ads', name: 'Google Ads', type: 'oauth', icon: '📈', desc: 'Track campaigns, scale PMax assets, and bid budgets.' },
    { id: 'shopify', name: 'Shopify Store', type: 'oauth', icon: '🛍️', desc: 'Import product collections and execute store hooks.' },
    { id: 'woocommerce', name: 'WooCommerce', type: 'oauth', icon: '💳', desc: 'Sync inventory, categories, and checkout orders.' },
    { id: 'dealernet', name: 'DealerNet ERP', type: 'credentials', icon: '🚗', desc: 'Extract dealership inventory and automotive listings.' },
    { id: 'sap', name: 'SAP ERP Integration', type: 'credentials', icon: '🏢', desc: 'Execute SAP ledger actions and secure corporate logs.' },
    { id: 'salesforce', name: 'Salesforce CRM', type: 'credentials', icon: '☁️', desc: 'Sync accounts, campaign logs, and pipeline leads.' }
  ];

  const handleCardClick = (prov: ProviderCard) => {
    setSelectedProvider(prov);
    setAccountName(`${prov.name} Account`);
    setUsername('');
    setPassword('');
    setCustomMetadata('');
    setOauthStep('start');
    setModalOpen(true);
  };

  const handleOAuthSimulate = async () => {
    setOauthStep('loading');
    setTimeout(async () => {
      if (selectedProvider) {
        await connectOAuthAccount(selectedProvider.id, accountName);
      }
      setOauthStep('success');
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    }, 1500);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !username || !password) return;

    await connectNonOAuthAccount(selectedProvider.id, accountName, {
      username,
      password,
      metadata: customMetadata
    });
    
    setModalOpen(false);
  };

  const recommendationMap: Record<string, string[]> = {
    'marketing-agency': ['instagram', 'facebook', 'threads', 'tiktok', 'google_business'],
    'ecommerce': ['instagram', 'facebook', 'shopify', 'woocommerce', 'google_ads'],
    'real-estate': ['instagram', 'facebook', 'google_business'],
    'tech-saas': ['telegram', 'sap', 'salesforce']
  };

  const recommendedIds = businessTemplate ? (recommendationMap[businessTemplate] || []) : [];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', maxHeight: '350px', overflowY: 'auto', padding: '8px' }}>
        {providers.map((prov) => {
          const isConnected = socialAccounts.some(a => a.provider.toLowerCase() === prov.id.toLowerCase());
          const isRecommended = recommendedIds.includes(prov.id);
          
          let cardBg = 'transparent';
          let shadowStyle = 'none';

          if (isConnected) {
            // green connected
          } else if (isRecommended) {
            cardBg = 'rgba(139, 92, 246, 0.03)';
            shadowStyle = '0 0 10px rgba(139, 92, 246, 0.1)';
          }

          return (
            <div
              key={prov.id}
              onClick={() => handleCardClick(prov)}
              className="glass-card"
              style={{
                padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px',
                borderColor: isConnected ? 'var(--color-success)' : (isRecommended ? 'var(--color-primary)' : 'var(--color-border)'),
                borderWidth: isConnected ? '2px' : '1px',
                background: cardBg,
                boxShadow: shadowStyle,
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{prov.icon}</span>
                {isConnected ? (
                  <span style={{
                    fontSize: '11px', background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)',
                    padding: '2px 8px', borderRadius: '4px', fontWeight: 600
                  }}>
                    Connected
                  </span>
                ) : isRecommended ? (
                  <span style={{
                    fontSize: '10px', background: 'rgba(139,92,246,0.15)', color: 'var(--color-primary)',
                    padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px'
                  }}>
                    ★ Recommended
                  </span>
                ) : null}
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{prov.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{prov.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection simulator modal */}
      {modalOpen && selectedProvider && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          
          {/* OAUTH SIMULATOR BOX */}
          {selectedProvider.type === 'oauth' && (
            <div className="glass-panel" style={{ width: '450px', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{selectedProvider.icon}</span> Connect {selectedProvider.name}
              </h3>
              
              {oauthStep === 'start' && (
                <>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    Clicking continue will direct you to <strong>{selectedProvider.name}</strong> secure OAuth verification page. No password or secrets are shared with us.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px' }}>Connection Display Identifier</label>
                    <input type="text" className="glass-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                    <button className="btn-primary" onClick={handleOAuthSimulate}>
                      Connect with OAuth <ExternalLink size={14} />
                    </button>
                  </div>
                </>
              )}

              {oauthStep === 'loading' && (
                <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  <strong>Authorizing via secure API handshake...</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Retrieving tokens, scopes, pages, and metadata...</span>
                </div>
              )}

              {oauthStep === 'success' && (
                <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--color-success)' }}>
                  <ShieldCheck size={48} />
                  <strong>Access Granted Successfully!</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Workspace environment registered securely.</span>
                </div>
              )}
            </div>
          )}

          {/* CREDENTIALS/NON-OAUTH FORM */}
          {selectedProvider.type === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="glass-panel" style={{ width: '480px', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: 'var(--color-primary)' }} /> Secure Login: {selectedProvider.name}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: '12px' }}>
                <ShieldAlert size={16} />
                <span>Credentials will be encrypted with AES-256-GCM and stored in the secure vault.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Account Identifier Name</label>
                <input type="text" required className="glass-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px' }}>Username / Domain ID</label>
                  <input type="text" required className="glass-input" placeholder="e.g. operator_admin" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px' }}>Password / Access Key</label>
                  <input type="password" required className="glass-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Custom Config Metadata (Optional JSON)</label>
                <input type="text" className="glass-input" placeholder='{"port": 443, "cluster": "us-east"}' value={customMetadata} onChange={(e) => setCustomMetadata(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  Validate & Vault <LogIn size={14} />
                </button>
              </div>
            </form>
          )}

        </div>
      )}
      {/* Provisioning pipeline progress overlay */}
      {activeProvisioning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 4000
        }}>
          <div className="glass-panel" style={{ width: '520px', borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '6px', fontWeight: 600 }}>Provisioning Isolated Environment</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Enforcing anti-detection footprint policies and network containment...</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeProvisioning.steps.map((step, idx) => {
                let icon = '⚪';
                let color = 'var(--color-text-muted)';
                let isSpinning = false;

                if (step.status === 'processing') {
                  icon = '🔄';
                  color = 'var(--color-primary)';
                  isSpinning = true;
                } else if (step.status === 'success') {
                  icon = '✅';
                  color = 'var(--color-success)';
                } else if (step.status === 'failed') {
                  icon = '❌';
                  color = 'var(--color-danger)';
                }

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: step.status === 'pending' ? 0.35 : 1 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      display: 'inline-block',
                      animation: isSpinning ? 'spin 1.5s linear infinite' : 'none'
                    }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: step.status === 'processing' ? '#fff' : color }}>
                        {step.name}
                      </div>
                      {step.message && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                          {step.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {activeProvisioning.status === 'COMPLETED' && (
              <button 
                className="btn-primary" 
                onClick={clearActiveProvisioning}
                style={{ width: '100%', marginTop: '10px', background: 'var(--color-success)', borderColor: 'var(--color-success)', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Environment Ready - Continue
              </button>
            )}

            {activeProvisioning.status === 'FAILED' && (
              <button 
                className="btn-primary" 
                onClick={clearActiveProvisioning}
                style={{ width: '100%', marginTop: '10px', background: 'var(--color-danger)', borderColor: 'var(--color-danger)', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Close - Check Logs
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
