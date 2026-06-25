import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

const DebuggerPanel: React.FC = () => {
  const { nodes, selectedNodeId, nodeStates } = useBuilderStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const executionState = selectedNode ? nodeStates[selectedNode.id] : null;

  if (!selectedNode) {
    return (
      <aside className="debugger-panel glass-panel">
        <div className="empty-inspector">
          <p>Select a node to inspect its execution state.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="debugger-panel glass-panel">
      <div className="inspector-header">
        <h3>Live Debugger</h3>
      </div>
      <div className="inspector-content">
        <div className="status-badge" data-status={executionState?.status || 'idle'}>
          Status: {executionState?.status || 'idle'}
        </div>
        
        {executionState?.duration && (
          <div className="execution-stat">
            <span>Duration:</span>
            <span>{executionState.duration}ms</span>
          </div>
        )}

        <hr className="inspector-divider" />
        
        <h4>Inputs Snapshot</h4>
        <pre className="json-block">
          {JSON.stringify(selectedNode.data.inputs || {}, null, 2)}
        </pre>

        <h4>Outputs Snapshot</h4>
        <pre className="json-block">
          {JSON.stringify(executionState?.outputs || {}, null, 2)}
        </pre>

        <h4>Live Logs</h4>
        <div className="log-stream">
          {executionState?.logs?.map((log, i) => (
            <div key={i} className="log-line">{log}</div>
          )) || <div className="log-line text-muted">Waiting for execution...</div>}
        </div>
      </div>
    </aside>
  );
};

export default DebuggerPanel;
