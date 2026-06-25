import React, { useState, useEffect } from 'react';
import { useUIStore, type CredentialInfo } from '../../store/useUIStore';
import { Key, Plus, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

export const CredentialsPanel: React.FC = () => {
  const { credentials, fetchCredentials, createCredential, rotateCredential, isLoading } = useUIStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [selectedCred, setSelectedCred] = useState<CredentialInfo | null>(null);

  // Add Credential Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('API_KEY');
  const [provider, setProvider] = useState('GOOGLE_ADS');
  const [scope] = useState('GLOBAL');
  const [secret, setSecret] = useState('');
  
  // Rotate Form State
  const [newSecret, setNewSecret] = useState('');

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !secret) return;

    try {
      await createCredential({
        name,
        type,
        provider,
        scope,
        ownerId: 'operator-1',
        plainTextSecret: secret
      });
      // Clear forms
      setName('');
      setSecret('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRotateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCred || !newSecret) return;

    try {
      await rotateCredential(selectedCred.id, newSecret);
      setNewSecret('');
      setShowRotateModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Credential Center</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage secure credentials, API tokens, and certificate vaults for automated workers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px var(--glow-primary)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={16} />
          Register Credential
        </button>
      </div>

      {/* Database sync status */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--color-primary)', animation: 'spin 2s linear infinite' }} />
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          {credentials.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Lock size={48} style={{ margin: '0 auto 16px', color: 'var(--color-text-muted)', opacity: 0.5 }} />
              <h3>No credentials found in the Secure Vault.</h3>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Click "Register Credential" above to secure your first enterprise access token.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px' }}>Credential Name</th>
                    <th style={{ padding: '16px' }}>Type</th>
                    <th style={{ padding: '16px' }}>Provider</th>
                    <th style={{ padding: '16px' }}>Scope</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map((cred) => (
                    <tr key={cred.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row-hover">
                      <td style={{ padding: '16px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Key size={16} style={{ color: 'var(--color-primary)' }} />
                          {cred.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>{cred.type}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: 'var(--color-primary)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}>
                          {cred.provider}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>{cred.scope}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-success)' }}>
                          <CheckCircle2 size={14} />
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setSelectedCred(cred);
                              setShowRotateModal(true);
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              color: 'var(--color-text)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <RefreshCw size={12} />
                            Rotate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <form onSubmit={handleAddSubmit} className="glass-panel" style={{
            width: '500px', borderRadius: '12px', padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              Register Secure Credential
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Credential Identifier / Name</label>
              <input
                type="text"
                required
                placeholder="e.g. google-ads-production-api"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Credential Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input">
                  <option value="API_KEY">API Key</option>
                  <option value="OAUTH2">OAuth2 Token</option>
                  <option value="PASSWORD">Password</option>
                  <option value="SSH_KEY">SSH Key</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Vault Provider</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value)} className="glass-input">
                  <option value="GOOGLE_ADS">Google Ads</option>
                  <option value="SAP">SAP ERP</option>
                  <option value="SALESFORCE">Salesforce CRM</option>
                  <option value="SHOPIFY">Shopify E-Commerce</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Secret Token / Value</label>
              <input
                type="password"
                required
                placeholder="Enter secret token value (will be encrypted)"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="glass-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: 'var(--color-primary)', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Save to Vault
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ROTATE MODAL */}
      {showRotateModal && selectedCred && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <form onSubmit={handleRotateSubmit} className="glass-panel" style={{
            width: '450px', borderRadius: '12px', padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              Rotate Credential Secret
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              You are rotating the secret key for credential: <strong>{selectedCred.name}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>New Secret Value</label>
              <input
                type="password"
                required
                placeholder="Enter new secret key"
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                className="glass-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setShowRotateModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: 'var(--color-primary)', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Confirm Rotation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
