import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

const TimelineVisualizer: React.FC = () => {
  const { timelineEvents, setSelectedNode } = useBuilderStore();

  if (timelineEvents.length === 0) return null;

  return (
    <div className="timeline-visualizer glass-panel">
      <div className="timeline-header">
        <h4>Execution Timeline</h4>
      </div>
      <div className="timeline-track">
        {timelineEvents.map((event) => (
          <div 
            key={event.id} 
            className={`timeline-node status-${event.type}`}
            onClick={() => setSelectedNode(event.nodeId)}
          >
            <div className="timeline-time">{new Date(event.timestamp).toLocaleTimeString()}</div>
            <div className="timeline-message">{event.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineVisualizer;
