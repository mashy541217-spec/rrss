import React, { useState } from 'react';
import { useAccountStore } from '../store/useAccountStore';
import { Server, Plus, Copy, Archive, Edit2 } from 'lucide-react';


export const WorkspaceManager: React.FC = () => {
  const { workspaces, createWorkspace, renameWorkspace, archiveWorkspace, duplicateWorkspace } = useAccountStore();
  // We'll just mock this check for workspace creation as well or assume unlimited workspaces for now based on the limit engine

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
      setIsModalOpen(false);
    }
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameWorkspace(id, editingName);
      setEditingId(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-success)' }}>
            <Server size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Workspaces</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Manage isolated environments across your organization.</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 600 }}>
          <Plus size={16} /> New Workspace
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {workspaces.map(ws => (
          <div key={ws.id} className="glass-card" style={{ padding: '24px', position: 'relative', opacity: ws.status === 'archived' ? 0.6 : 1 }}>
            
            {/* Action Menu (Mocked with hover absolute buttons for simplicity) */}
            <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
              <button title="Rename" onClick={() => { setEditingId(ws.id); setEditingName(ws.name); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Edit2 size={14} /></button>
              <button title="Duplicate" onClick={() => duplicateWorkspace(ws.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Copy size={14} /></button>
              {ws.status === 'active' && (
                <button title="Archive" onClick={() => archiveWorkspace(ws.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Archive size={14} /></button>
              )}
            </div>

            {editingId === ws.id ? (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input type="text" className="glass-input" value={editingName} onChange={(e) => setEditingName(e.target.value)} autoFocus style={{ flex: 1, padding: '4px 8px' }} />
                <button className="btn-primary" onClick={() => handleRename(ws.id)} style={{ padding: '4px 12px' }}>Save</button>
              </div>
            ) : (
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', paddingRight: '60px' }}>{ws.name}</h3>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              <div><span style={{ fontWeight: 600, color: '#fff' }}>{ws.businessCount}</span> Businesses</div>
              <div><span style={{ fontWeight: 600, color: '#fff' }}>{ws.memberCount}</span> Members</div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {ws.status === 'active' ? (
                  <span style={{ color: 'var(--color-success)' }}>● Active</span>
                ) : (
                  <span>○ Archived</span>
                )}
              </span>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Enter Workspace
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleCreate} className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Create New Workspace</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Workspace Name</label>
              <input type="text" className="glass-input" value={newWorkspaceName} onChange={(e) => setNewWorkspaceName(e.target.value)} required autoFocus placeholder="e.g. LATAM Operations" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
