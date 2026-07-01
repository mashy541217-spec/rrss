import React from 'react';
import ReactDOM from 'react-dom/client';
import { OnboardingWizard } from './components/OnboardingWizard';
import { AuthGate } from './components/AuthGate';
import { Layout } from './components/Layout';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import './index.css';

const App: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useWorkspaceStore();

  return (
    <React.StrictMode>
      {!isAuthenticated ? (
        <AuthGate />
      ) : !isOnboarded ? (
        <OnboardingWizard />
      ) : (
        <Layout />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
