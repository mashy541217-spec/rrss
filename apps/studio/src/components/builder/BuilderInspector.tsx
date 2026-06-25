import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

const BuilderInspector: React.FC = () => {
  const { nodes, selectedNodeId, updateNodeData } = useBuilderStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="builder-inspector glass-panel">
        <div className="empty-inspector">
          <p>Select a node to inspect its properties.</p>
        </div>
      </aside>
    );
  }

  const { data } = selectedNode;

  return (
    <aside className="builder-inspector glass-panel">
      <div className="inspector-header">
        <h3>Properties</h3>
      </div>
      <div className="inspector-content">
        <div className="form-group">
          <label>Node ID</label>
          <input type="text" value={selectedNode.id} disabled className="form-input disabled" />
        </div>
        <div className="form-group">
          <label>Label</label>
          <input 
            type="text" 
            value={data.label} 
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="form-input" 
          />
        </div>
        <div className="form-group">
          <label>Plugin Type</label>
          <input type="text" value={data.type} disabled className="form-input disabled" />
        </div>
        <hr className="inspector-divider" />
        <h4>Inputs Configuration</h4>
        {data.inputs?.length > 0 ? data.inputs.map((input: string) => (
          <div key={input} className="form-group">
            <label>{input}</label>
            <input type="text" placeholder={`Enter ${input} or Expression`} className="form-input" />
          </div>
        )) : <p className="text-muted">No inputs required.</p>}
      </div>
    </aside>
  );
};

export default BuilderInspector;
