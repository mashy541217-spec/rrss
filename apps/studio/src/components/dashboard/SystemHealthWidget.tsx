import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Activity } from 'lucide-react';

const SystemHealthWidget: React.FC = () => {
  const { systemHealth } = useTelemetryStore();

  return (
    <div className="glass-card">
      <h3 className="widget-title"><Activity size={18} /> System Health</h3>
      <div className="health-list">
        {Object.entries(systemHealth).map(([service, status]) => (
          <div key={service} className="health-item">
            <span className="health-service">{service.toUpperCase()}</span>
            <div className={`health-badge status-${status}`}>
              <span className="health-dot"></span>
              {status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealthWidget;
