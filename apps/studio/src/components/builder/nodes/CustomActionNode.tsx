import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Zap, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useBuilderStore } from '../../../store/useBuilderStore';

const CustomActionNode = ({ id, data, selected }: NodeProps) => {
  const executionState = useBuilderStore(state => state.nodeStates[id]);
  const status = executionState?.status || 'idle';

  return (
    <div className={`custom-node glass-card ${selected ? 'selected' : ''} status-${status}`} style={{ borderColor: selected ? data.color : 'var(--border-color)' }}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      
      <div className="node-header" style={{ borderBottomColor: data.color }}>
        {status === 'running' && <Loader size={16} className="spin-icon" color="var(--status-info)" />}
        {status === 'success' && <CheckCircle size={16} color="var(--status-success)" />}
        {status === 'failed' && <XCircle size={16} color="var(--status-error)" />}
        {status === 'idle' && <Zap size={16} color={data.color} />}
        <span className="node-title">{data.label}</span>
      </div>
      
      <div className="node-body">
        <div className="ports-container">
          <div className="ports inputs">
            {data.inputs?.map((input: string) => (
              <div key={`in-${input}`} className="port">
                <span className="port-label">{input}</span>
              </div>
            ))}
          </div>
          <div className="ports outputs">
            {data.outputs?.map((output: string) => (
              <div key={`out-${output}`} className="port">
                <span className="port-label">{output}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
};

export default memo(CustomActionNode);
