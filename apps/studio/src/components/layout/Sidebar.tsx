import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Workflow, 
  Megaphone, 
  FileText, 
  Key, 
  Plug, 
  Server, 
  Activity, 
  CalendarClock, 
  Users, 
  Briefcase, 
  Globe, 
  Terminal, 
  Settings 
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/builder', icon: Workflow, label: 'Automation Builder' },
  { path: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { path: '/content', icon: FileText, label: 'Content' },
  { path: '/credentials', icon: Key, label: 'Credentials' },
  { path: '/plugins', icon: Plug, label: 'Plugins' },
  { path: '/workers', icon: Server, label: 'Workers' },
  { path: '/executions', icon: Activity, label: 'Executions' },
  { path: '/scheduler', icon: CalendarClock, label: 'Scheduler' },
  { path: '/identity', icon: Users, label: 'Identity' },
  { path: '/workspace', icon: Briefcase, label: 'Workspace' },
  { path: '/browser-sessions', icon: Globe, label: 'Browser Sessions' },
  { path: '/logs', icon: Terminal, label: 'Logs' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Workflow size={24} color="var(--accent-primary)" />
        </div>
        <h2 className="brand-name">RRSS AUTO</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
