import React from 'react';
import CredentialList from '../components/credentials/CredentialList';
import { Plus } from 'lucide-react';
import '../components/credentials/credentials.css';

const CredentialCenterPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Credential Center</h1>
          <p className="text-muted">Manage Vault Secrets, Tokens, and OAuth connections securely.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Credential
        </button>
      </header>
      <CredentialList />
    </div>
  );
};

export default CredentialCenterPage;
