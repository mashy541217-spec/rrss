import React, { useCallback, useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { ReactFlow, Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Save, Play, Sparkles } from 'lucide-react';

interface AutomationVisualBuilderProps {
  mode: 'blank' | 'ai' | 'template';
  onClose: () => void;
}

const initialNodes: Node[] = [
  { id: 'trigger-1', position: { x: 250, y: 100 }, data: { label: 'Trigger: New DAM Asset' }, style: { background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px' } }
];

const aiNodes: Node[] = [
  { id: 'trigger-1', position: { x: 250, y: 100 }, data: { label: 'Trigger: New DAM Asset (Promo)' }, style: { background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px' } },
  { id: 'action-1', position: { x: 250, y: 250 }, data: { label: 'Action: Create Campaign Draft' }, style: { background: 'rgba(139, 92, 246, 0.2)', color: '#fff', border: '1px solid var(--color-primary)', borderRadius: '8px', padding: '16px' } },
  { id: 'action-2', position: { x: 250, y: 400 }, data: { label: 'Action: Notify Marketing Team' }, style: { background: 'rgba(139, 92, 246, 0.2)', color: '#fff', border: '1px solid var(--color-primary)', borderRadius: '8px', padding: '16px' } }
];

const aiEdges: Edge[] = [
  { id: 'e1-2', source: 'trigger-1', target: 'action-1', animated: true, style: { stroke: 'var(--color-primary)' } },
  { id: 'e2-3', source: 'action-1', target: 'action-2', animated: true, style: { stroke: 'var(--color-primary)' } }
];

export const AutomationVisualBuilder: React.FC<AutomationVisualBuilderProps> = ({ mode, onClose }) => {
  const { createAutomation } = useWorkspaceStore();
  const [nodes, setNodes] = useState<Node[]>(mode === 'ai' ? aiNodes : initialNodes);
  const [edges, setEdges] = useState<Edge[]>(mode === 'ai' ? aiEdges : []);
  const [name, setName] = useState(mode === 'ai' ? 'AI Promo Workflow' : 'Untitled Workflow');

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleSave = () => {
    createAutomation({
      name,
      status: 'Active',
      nodes,
      edges
    });
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px' }}><X size={16} /></button>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', fontWeight: 600, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {mode === 'ai' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontSize: '13px', marginRight: '16px' }}>
              <Sparkles size={16} /> AI Generated
            </div>
          )}
          <button className="btn-secondary" onClick={() => handleSave()}><Save size={14} /> Save Draft</button>
          <button className="btn-primary" onClick={() => handleSave()}><Play size={14} /> Publish & Turn On</button>
        </div>
      </div>
      
      {/* Node Builder Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Background color="rgba(255,255,255,0.1)" gap={16} />
          <Controls style={{ background: 'var(--bg-secondary)', fill: '#fff', border: '1px solid var(--glass-border)' }} />
        </ReactFlow>

        {/* Sidebar Controls (Mocked) */}
        <div className="glass-panel" style={{ position: 'absolute', top: '20px', left: '20px', width: '250px', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: 0 }}>Add Node</h4>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: 0 }} />
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Triggers</div>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }}>+ New DAM Asset</button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }}>+ Campaign Started</button>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '4px' }}>Actions</div>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }}>+ Publish to Instagram</button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }}>+ Send Email</button>
        </div>
      </div>
    </div>
  );
};
