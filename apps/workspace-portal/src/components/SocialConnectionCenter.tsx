import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { useLimitEngine } from '../lib/LimitEngine';

interface ProviderCard {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const SocialConnectionCenter: React.FC = () => {
  const { activeBusinessId, activeProvisioning, clearActiveProvisioning, businessTemplate } = useWorkspaceStore();
  
  const [selectedProvider, setSelectedProvider] = useState<ProviderCard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState<'idle' | 'auth' | 'permissions' | 'validating' | 'success'>('idle');
  const [realAccounts, setRealAccounts] = useState<any[]>([]);

  React.useEffect(() => {
    if (activeBusinessId) {
      fetch(`http://localhost:3000/api/social/accounts?businessId=${activeBusinessId}`)
        .then(res => res.json())
        .then(data => setRealAccounts(data))
        .catch(err => console.error('Failed to load accounts', err));
    }
  }, [activeBusinessId]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Refresh accounts
      if (activeBusinessId) {
        fetch(`http://localhost:3000/api/social/accounts?businessId=${activeBusinessId}`)
          .then(res => res.json())
          .then(data => setRealAccounts(data))
          .catch(err => console.error('Failed to load accounts', err));
      }
    }
  }, [activeBusinessId]);

  const providers: ProviderCard[] = [
    { id: 'instagram', name: 'Instagram', icon: '📸', desc: 'Auto-publish reels, feeds, stories and replies.' },
    { id: 'facebook', name: 'Facebook', icon: '👥', desc: 'Sync timelines, group sharing, and meta ad metrics.' },
    { id: 'messenger', name: 'Messenger', icon: '💬', desc: 'Automate replies and manage direct messages.' },
    { id: 'threads', name: 'Threads', icon: '🧵', desc: 'Integrate post shares and user communications.' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: '📞', desc: 'Manage messaging APIs, template queues, and bots.' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', desc: 'Broadcasting integrations and message logs.' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', desc: 'Publish video campaigns and sync trends.' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', desc: 'Professional networking and B2B lead generation.' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', desc: 'Video uploads, scheduling, and comment moderation.' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', desc: 'Board management and visual discovery analytics.' },
    { id: 'twitter', name: 'X (Twitter)', icon: '🐦', desc: 'Real-time updates, threads, and engagement.' },
    { id: 'google_business', name: 'Google Business', icon: '📍', desc: 'Update maps listings, hours, and review replies.' },
    { id: 'google_ads', name: 'Google Ads', icon: '📈', desc: 'Track campaigns, scale PMax assets, and bid budgets.' },
    { id: 'meta_ads', name: 'Meta Ads', icon: '🎯', desc: 'Manage Facebook and Instagram ad budgets and ROI.' }
  ];

  const { canAddSocialAccount } = useLimitEngine();

  const handleCardClick = (prov: ProviderCard) => {
    if (!canAddSocialAccount()) return;
    setSelectedProvider(prov);
    setWizardStep('idle');
    setModalOpen(true);
  };

  const startWizard = async () => {
    if (!selectedProvider || !activeBusinessId) return;
    setWizardStep('auth');
    try {
      const response = await fetch('http://localhost:3000/api/social/oauth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider.id, businessId: activeBusinessId })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to official OAuth provider
      }
    } catch (e) {
      console.error(e);
      setModalOpen(false);
    }
  };

  const recommendationMap: Record<string, string[]> = {
    'marketing-agency': ['instagram', 'facebook', 'threads', 'tiktok', 'google_business'],
    'ecommerce': ['instagram', 'facebook', 'google_ads', 'meta_ads'],
    'retail': ['instagram', 'facebook', 'google_business', 'whatsapp'],
    'restaurant': ['instagram', 'facebook', 'google_business'],
    'hotel': ['instagram', 'facebook', 'google_business', 'pinterest'],
    'real-estate': ['instagram', 'facebook', 'google_business', 'linkedin'],
    'medical': ['facebook', 'whatsapp', 'google_business'],
    'law': ['linkedin', 'twitter', 'google_business'],
    'tech-saas': ['twitter', 'linkedin', 'youtube', 'telegram'],
    'education': ['youtube', 'tiktok', 'instagram', 'linkedin'],
    'automotive': ['instagram', 'facebook', 'whatsapp', 'google_business'],
    'influencer': ['instagram', 'tiktok', 'youtube', 'twitter'],
    'freelancer': ['linkedin', 'twitter', 'instagram', 'youtube']
  };

  const recommendedIds = businessTemplate ? (recommendationMap[businessTemplate] || []) : [];
  

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', maxHeight: '500px', overflowY: 'auto', padding: '8px' }}>
        {providers.map((prov) => {
          const connection = realAccounts.find(a => a.platform.toLowerCase() === prov.id.toLowerCase());
          const isConnected = !!connection;
          const isRecommended = recommendedIds.includes(prov.id);
          
          let cardBg = 'transparent';
          let shadowStyle = 'none';

          if (isConnected) {
            cardBg = 'rgba(16, 185, 129, 0.05)';
            shadowStyle = '0 0 12px rgba(16, 185, 129, 0.15)';
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
                {isConnected && connection.avatar ? (
                  <img src={connection.avatar} alt={prov.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(16,185,129,0.3)' }} />
                ) : (
                  <span style={{ fontSize: '24px' }}>{prov.icon}</span>
                )}
                {isConnected ? (
                  <span style={{
                    fontSize: '11px', background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)',
                    padding: '2px 8px', borderRadius: '4px', fontWeight: 600
                  }}>
                    {connection.status === 'SYNCHRONIZING' ? '🟡 Synchronizing' : 
                     connection.status === 'NEEDS_ATTENTION' ? '🟠 Needs Attention' : '🟢 Connected'}
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
              
              {!isConnected ? (
                <div>
                  <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{prov.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{prov.desc}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '0' }}>{connection.name}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{connection.handle} • {connection.followers.toLocaleString()} followers</span>
                  </div>
                  
                  {connection.capabilities && connection.capabilities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {connection.capabilities.map((cap: string) => (
                        <span key={cap} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', color: '#aaa', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {cap.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      Status: {connection.syncStatus}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fetch('http://localhost:3000/api/social/synchronize', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ credentialId: connection.id })
                        }).then(() => window.location.reload());
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Connection Wizard Modal */}
      {modalOpen && selectedProvider && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          
          <div className="glass-panel" style={{ width: '450px', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{selectedProvider.icon}</span> Connect {selectedProvider.name}
            </h3>
            
            {wizardStep === 'idle' && (
              <>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  You are about to connect <strong>{selectedProvider.name}</strong> to this business. Clicking continue will open a secure window to authenticate.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button className="btn-primary" onClick={startWizard}>
                    Connect <ExternalLink size={14} />
                  </button>
                </div>
              </>
            )}

            {wizardStep === 'auth' && (
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <strong>Authenticating with {selectedProvider.name}...</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Awaiting secure handshake.</span>
              </div>
            )}

            {wizardStep === 'permissions' && (
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: 'var(--color-success)',
                  borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <strong>Granting Permissions...</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Retrieving scopes and pages.</span>
              </div>
            )}

            {wizardStep === 'validating' && (
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(245,158,11,0.2)', borderTopColor: 'var(--color-warning)',
                  borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <strong>Validating Connection...</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Ensuring environment isolation.</span>
              </div>
            )}

            {wizardStep === 'success' && (
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--color-success)' }}>
                <ShieldCheck size={48} />
                <strong>Connected Successfully!</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{selectedProvider.name} is now linked to this business.</span>
              </div>
            )}
          </div>

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
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Configuring secure workspace environment...</p>
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
