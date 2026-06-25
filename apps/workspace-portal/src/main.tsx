import React from 'react';
import ReactDOM from 'react-dom/client';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Layout } from './components/Layout';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import './index.css';

const App: React.FC = () => {
  const { isOnboarded } = useWorkspaceStore();

  return (
    <React.StrictMode>
      {isOnboarded ? <Layout /> : <OnboardingWizard />}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
