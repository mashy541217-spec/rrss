import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, Briefcase, FolderOpen } from 'lucide-react';

export const BusinessManager: React.FC = () => {
  const { businesses, addBusiness, socialAccounts } = useWorkspaceStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('E-Commerce & Retail');
  const [selectedBusIdx, setSelectedBusIdx] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addBusiness(name, category);
    setName('');
    setShowAddModal(false);
  };

  const activeBus = businesses[selectedBusIdx];

  const campaignsMock = [
    { id: '1', name: 'Auto-Promo Reels', channel: 'Instagram', budget: '$500', status: 'Active' },
    { id: '2', name: 'Facebook Banner Retargeting', channel: 'Facebook', budget: '$1,500', status: 'Scheduled' }
  ];

  const automationsMock = [
    { id: '1', name: 'Instagram Media Sync & Post', status: 'Enabled', trigger: 'On New File Upload' }
  ];

  const mediaMock = [
    { name: 'product_showcase_01.jpg', size: '1.2 MB', type: 'image/jpeg' },
    { name: 'summer_promo_reel.mp4', size: '14.5 MB', type: 'video/mp4' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', height: '100%', minHeight: '550px' }}>
      
      {/* Sidebar Business list */}
      <div className="glass-panel" style={{ borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Business Units</h3>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          {businesses.map((bus, idx) => (
            <div
              key={bus.id}
              onClick={() => setSelectedBusIdx(idx)}
              className="glass-card"
              style={{
                padding: '12px', cursor: 'pointer',
                borderColor: idx === selectedBusIdx ? 'var(--color-primary)' : 'var(--color-border)',
                background: idx === selectedBusIdx ? 'rgba(139, 92, 246, 0.05)' : 'transparent'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} style={{ color: 'var(--color-primary)' }} /> {bus.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {bus.category} | {bus.socialAccountsCount} accounts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Business Details Tab Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!activeBus ? (
          <div className="glass-panel" style={{ borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No Business Units registered in this Workspace. Click the plus button to register one.
          </div>
        ) : (
          <>
            {/* Header info */}
            <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>{activeBus.name}</h2>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '2px' }}>
                  Industry Category: <strong>{activeBus.category}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  Connected Social Profiles: <strong>{socialAccounts.length}</strong>
                </span>
              </div>
            </div>

            {/* Grid layout containing social accounts connected + campaigns + media files */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Linked Accounts */}
              <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                  Connected Accounts
                </h3>
                {socialAccounts.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>No social channels associated to this business. Link them via the Onboarding flow or Assistant.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {socialAccounts.map((acc) => (
                      <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                        <span>{acc.provider.toLowerCase() === 'instagram' ? '📸' : '👥'}</span>
                        <div style={{ flex: 1 }}>
                          <div><strong>{acc.name}</strong></div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>@{acc.username}</div>
                        </div>
                        <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Campaigns */}
              <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                  Marketing Campaigns
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {campaignsMock.map((camp) => (
                    <div key={camp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                      <div>
                        <strong>{camp.name}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Channel: {camp.channel} | Budget: {camp.budget}</div>
                      </div>
                      <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{camp.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Automations */}
              <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                  Active Automations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {automationsMock.map((aut) => (
                    <div key={aut.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                      <div>
                        <strong>{aut.name}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Trigger: {aut.trigger}</div>
                      </div>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{aut.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Assets Storage Folder */}
              <div className="glass-panel" style={{ borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderOpen size={14} /> Media Assets Storage
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mediaMock.map((m) => (
                    <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                      <div>
                        <strong>{m.name}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{m.type}</div>
                      </div>
                      <span style={{ color: 'var(--color-text-muted)' }}>{m.size}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Add Business Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '450px', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Register Business Unit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px' }}>Business Display Name</label>
              <input type="text" required className="glass-input" placeholder="e.g. Nike Agency Division" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Corporate / Financial Services">Corporate / Financial Services</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Business</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
