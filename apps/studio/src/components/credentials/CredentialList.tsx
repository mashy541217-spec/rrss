import React from 'react';
import { useCredentialStore } from '../../store/useCredentialStore';
import { KeyRound, RotateCcw, Trash2 } from 'lucide-react';

const CredentialList: React.FC = () => {
  const { credentials, revokeCredential, rotateCredential } = useCredentialStore();

  return (
    <div className="credential-list glass-card">
      <div className="list-header">
        <h3>Secure Vault</h3>
      </div>
      <table className="cred-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Type</th>
            <th>Workspace</th>
            <th>Status</th>
            <th>Last Rotated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map(cred => (
            <tr key={cred.id} className={cred.status === 'revoked' ? 'row-disabled' : ''}>
              <td className="fw-500">
                <div className="name-cell">
                  <KeyRound size={16} className="text-muted" />
                  {cred.name}
                </div>
              </td>
              <td>{cred.provider}</td>
              <td><span className="type-badge">{cred.type.toUpperCase()}</span></td>
              <td><span className="ws-badge">{cred.workspaceId}</span></td>
              <td>
                <span className={`status-badge status-${cred.status}`}>
                  {cred.status}
                </span>
              </td>
              <td className="text-muted">{new Date(cred.lastRotatedAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button className="icon-btn tooltip-host" onClick={() => rotateCredential(cred.id)} disabled={cred.status === 'revoked'}>
                    <RotateCcw size={16} />
                  </button>
                  <button className="icon-btn text-error tooltip-host" onClick={() => revokeCredential(cred.id)} disabled={cred.status === 'revoked'}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CredentialList;
