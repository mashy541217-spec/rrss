import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Facebook, Instagram, Linkedin, Twitter, CheckCircle2, ChevronRight, X, Sparkles, Youtube } from 'lucide-react';

export const SmartConnectionWizard: React.FC = () => {
  const { connectSocialAccount, socialAccounts, nextStep, prevStep } = useWorkspaceStore();
  const [connecting, setConnecting] = useState<string | null>(null);

  const networks = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook size={24} />, color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram size={24} />, color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} />, color: '#0A66C2' },
    { id: 'twitter', name: 'X (Twitter)', icon: <Twitter size={24} />, color: '#1DA1F2' },
    { id: 'tiktok', name: 'TikTok', icon: <Sparkles size={24} />, color: '#000000', outline: true },
    { id: 'youtube', name: 'YouTube', icon: <Youtube size={24} />, color: '#FF0000' }
  ];

  const handleConnect = async (provider: string, name: string) => {
    setConnecting(provider);
    await connectSocialAccount(provider, name);
    setConnecting(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Step 7 of 9</span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Connect Social Channels</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
          Link your brands social networks. Our Smart Wizard will establish secure OAuth connections without exposing keys.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {networks.map(net => {
          const isConnected = socialAccounts.some(a => a.provider === net.name);
          const isConnecting = connecting === net.name;

          return (
            <div
              key={net.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: net.outline ? 'rgba(255,255,255,0.1)' : net.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {net.icon}
                </div>
                <strong style={{ fontSize: '15px' }}>{net.name}</strong>
              </div>

              {isConnected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Connected
                </div>
              ) : isConnecting ? (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Connecting...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConnect(net.name, `My ${net.name} Page`)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button type="button" onClick={prevStep} className="btn-secondary">
          <X size={16} /> Back
        </button>
        <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
          {socialAccounts.length > 0 ? 'Continue to AI Setup' : 'Skip for now'} <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
};
