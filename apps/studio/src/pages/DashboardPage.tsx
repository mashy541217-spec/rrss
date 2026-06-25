import React, { useEffect } from 'react';
import WorkerStatusWidget from '../components/dashboard/WorkerStatusWidget';
import SystemHealthWidget from '../components/dashboard/SystemHealthWidget';
import ExecutionThroughputChart from '../components/dashboard/ExecutionThroughputChart';
import QueueStatusWidget from '../components/dashboard/QueueStatusWidget';
import { TelemetryService } from '../services/TelemetryService';
import '../components/dashboard/dashboard.css';

const DashboardPage: React.FC = () => {
  useEffect(() => {
    TelemetryService.start();
    return () => TelemetryService.stop();
  }, []);

  return (
    <div className="dashboard-container" style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1>Platform Operations Center</h1>
        <p className="text-muted">Digital Twin Telemetry Monitoring</p>
      </header>
      
      <div className="dashboard-grid">
        <WorkerStatusWidget />
        <SystemHealthWidget />
        <ExecutionThroughputChart />
        <QueueStatusWidget />
      </div>
    </div>
  );
};

export default DashboardPage;
