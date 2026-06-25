import React from 'react';
import { Bell, Search, User, Sparkles } from 'lucide-react';
import { TopBarExecutionControls } from '../debugger/TopBarExecutionControls';
import { useAIAssistantStore } from '../../store/useAIAssistantStore';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { togglePanel } = useAIAssistantStore();

  return (
    <header className="topbar glass-panel">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search commands, workflows, or nodes... (Ctrl+K)" className="search-input" />
      </div>
      <TopBarExecutionControls />
      <div className="topbar-actions">
        <button className="icon-btn tooltip-host" onClick={togglePanel} style={{ color: 'var(--accent-primary)' }}>
          <Sparkles size={20} />
        </button>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="username">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
