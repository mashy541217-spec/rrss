import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import BuilderPage from '../pages/BuilderPage';
import DashboardPage from '../pages/DashboardPage';
import MarketplacePage from '../pages/MarketplacePage';
import CredentialCenterPage from '../pages/CredentialCenterPage';

// Placeholder Pages
const PlaceholderPage: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
    <h1>{title}</h1>
    <p>This module is currently under construction in Sprint 8.</p>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="builder" element={<BuilderPage />} />
        <Route path="campaigns" element={<PlaceholderPage title="Campaigns" icon="📢" />} />
        <Route path="content" element={<PlaceholderPage title="Content" icon="📄" />} />
        <Route path="credentials" element={<CredentialCenterPage />} />
        <Route path="plugins" element={<MarketplacePage />} />
        <Route path="workers" element={<PlaceholderPage title="Workers" icon="🖥️" />} />
        <Route path="executions" element={<PlaceholderPage title="Executions" icon="⚡" />} />
        <Route path="scheduler" element={<PlaceholderPage title="Scheduler" icon="⏱️" />} />
        <Route path="identity" element={<PlaceholderPage title="Identity" icon="👥" />} />
        <Route path="workspace" element={<PlaceholderPage title="Workspace" icon="🏢" />} />
        <Route path="browser-sessions" element={<PlaceholderPage title="Browser Sessions" icon="🌐" />} />
        <Route path="logs" element={<PlaceholderPage title="Logs" icon="📝" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" icon="⚙️" />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
