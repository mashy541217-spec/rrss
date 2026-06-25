import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { ListTree } from 'lucide-react';

const QueueStatusWidget: React.FC = () => {
  const { queues } = useTelemetryStore();

  return (
    <div className="glass-card">
      <h3 className="widget-title"><ListTree size={18} /> Queue Status</h3>
      <div className="queue-list">
        <div className="queue-item">
          <span className="queue-name">Execution Queue</span>
          <span className="queue-count text-info">{queues.execution}</span>
        </div>
        <div className="queue-item">
          <span className="queue-name">Retry Queue</span>
          <span className="queue-count text-warning">{queues.retry}</span>
        </div>
        <div className="queue-item">
          <span className="queue-name">Dead Letter</span>
          <span className="queue-count text-error">{queues.deadLetter}</span>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusWidget;
