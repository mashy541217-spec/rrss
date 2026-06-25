import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Server, Cpu, MemoryStick } from 'lucide-react';

const WorkerStatusWidget: React.FC = () => {
  const { workers } = useTelemetryStore();

  return (
    <div className="glass-card widget-col-span-2">
      <h3 className="widget-title"><Server size={18} /> Active Workers</h3>
      <div className="worker-grid">
        {workers.map(w => (
          <div key={w.id} className="worker-card">
            <div className="worker-header">
              <span className="worker-plugin">{w.plugin}</span>
              <span className={`worker-status status-${w.status}`}>{w.status}</span>
            </div>
            <div className="worker-id">{w.id}</div>
            
            <div className="worker-metrics">
              <div className="metric-row">
                <Cpu size={14} className="text-muted" />
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${w.cpu}%`, backgroundColor: w.cpu > 80 ? 'var(--status-error)' : 'var(--status-info)' }}></div>
                </div>
                <span className="metric-val">{Math.round(w.cpu)}%</span>
              </div>
              <div className="metric-row">
                <MemoryStick size={14} className="text-muted" />
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(w.ram / 4096) * 100}%`, backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
                <span className="metric-val">{w.ram}MB</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerStatusWidget;
