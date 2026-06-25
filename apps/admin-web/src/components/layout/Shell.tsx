import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { VirtualTable } from '../common/VirtualTable';
import { CredentialsPanel } from '../modules/CredentialsPanel';
import {
  LayoutDashboard, Building2, Layers, Cpu, Radio, PlusSquare, 
  Puzzle, Key, Workflow, Cloud, Eye, ShieldCheck, ShoppingCart, 
  Bot, RefreshCw, Archive, Settings, Search, Bell, Sun, Moon, 
  Menu, X, Send, Sparkles, AlertTriangle
} from 'lucide-react';

export const Shell: React.FC = () => {
  const {
    theme, sidebarCollapsed, activeModule, selectedOrg, selectedWorkspace, 
    notifications, toggleTheme, setSidebarCollapsed, setActiveModule, 
    setSelectedOrg, setSelectedWorkspace, toggleCommandPalette, toggleAIAssistant,
    aiAssistantOpen, addNotification, clearNotification,
    workers, workspaces, credentials, fetchWorkers, fetchWorkspaces, fetchCredentials, createCredential
  } = useUIStore();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'assistant'; text: string; action?: { label: string; actionKey: string } }>>([
    { sender: 'assistant', text: 'Welcome to RRSS AUTO AI Operations. How can I help secure, deploy, or scale your infrastructure today?' }
  ]);

  // Load workspaces, workers, and credentials dynamically on mount
  useEffect(() => {
    fetchWorkspaces();
    fetchWorkers();
    fetchCredentials();
  }, [fetchWorkspaces, fetchWorkers, fetchCredentials]);

  // Refresh lists dynamically on active tab changes
  useEffect(() => {
    if (activeModule === 'dashboard' || activeModule === 'workers') {
      fetchWorkers();
    }
    if (activeModule === 'dashboard' || activeModule === 'credentials') {
      fetchCredentials();
    }
    if (activeModule === 'workspaces') {
      fetchWorkspaces();
    }
  }, [activeModule, fetchWorkers, fetchCredentials, fetchWorkspaces]);

  const orgs = ['RRSS Global Inc.', 'North America Logistics', 'EMEA Retail Group'];

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'organizations', name: 'Organizations', icon: <Building2 size={18} /> },
    { id: 'workspaces', name: 'Workspaces', icon: <Layers size={18} /> },
    { id: 'infrastructure', name: 'Infrastructure Center', icon: <Cpu size={18} /> },
    { id: 'workers', name: 'Worker Center', icon: <Radio size={18} /> },
    { id: 'provisioning', name: 'Provisioning Engine', icon: <PlusSquare size={18} /> },
    { id: 'plugins', name: 'Plugin Center', icon: <Puzzle size={18} /> },
    { id: 'credentials', name: 'Credential Center', icon: <Key size={18} /> },
    { id: 'automation', name: 'Automation Center', icon: <Workflow size={18} /> },
    { id: 'cloud', name: 'Cloud Center', icon: <Cloud size={18} /> },
    { id: 'observability', name: 'Observability Center', icon: <Eye size={18} /> },
    { id: 'security', name: 'Security Center', icon: <ShieldCheck size={18} /> },
    { id: 'marketplace', name: 'Marketplace Hub', icon: <ShoppingCart size={18} /> },
    { id: 'aiops', name: 'AI Operations', icon: <Bot size={18} /> },
    { id: 'deployment', name: 'Deployment Center', icon: <RefreshCw size={18} /> },
    { id: 'backup', name: 'Backup & Recovery', icon: <Archive size={18} /> },
    { id: 'settings', name: 'System Settings', icon: <Settings size={18} /> }
  ];

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt.trim();
    setAiChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    setTimeout(() => {
      let replyText = "I don't understand that command. Try asking 'Create 5 Windows Workers' or 'Register a Google Ads credential'.";
      let action = undefined;

      if (userMsg.toLowerCase().includes('windows') || userMsg.toLowerCase().includes('worker')) {
        replyText = "Cognitive engine parsed intent: PROVISION_WINDOWS_WORKERS. I have prepared the provisioning parameters for 5 new nodes on AWS. Click below to approve execution:";
        action = { label: 'Deploy 5 Windows Workers', actionKey: 'create_5_workers' };
      } else if (userMsg.toLowerCase().includes('scale') || userMsg.toLowerCase().includes('kubernetes')) {
        replyText = "Cognitive engine parsed intent: SCALE_KUBERNETES_POOL. I suggest scaling the EKS worker pool from 3 to 10 nodes to accommodate scheduled automation spikes. Approve scaling action:";
        action = { label: 'Scale EKS Node Pool to 10', actionKey: 'scale_k8s' };
      } else if (userMsg.toLowerCase().includes('telegram') || userMsg.toLowerCase().includes('install')) {
        replyText = "Cognitive engine parsed intent: INSTALL_PLUGIN. I will retrieve the verified @rrss-auto/plugin-telegram catalog signature. Approve installation:";
        action = { label: 'Install Telegram Plugin', actionKey: 'install_telegram' };
      } else if (userMsg.toLowerCase().includes('credential') || userMsg.toLowerCase().includes('secret') || userMsg.toLowerCase().includes('key')) {
        replyText = "Cognitive engine parsed intent: CREATE_CREDENTIAL. I have prepared the payload to register a secure Google Ads API credential in the vault. Approve registration:";
        action = { label: 'Register Google Ads Key', actionKey: 'create_google_ads_key' };
      }

      setAiChatLog((prev) => [...prev, { sender: 'assistant', text: replyText, action }]);
    }, 1000);
  };

  const handleAiAction = (actionKey: string) => {
    if (actionKey === 'create_5_workers') {
      addNotification('AWS provisioning queue updated. Starting Windows Worker template scaling...', 'success');
    } else if (actionKey === 'scale_k8s') {
      addNotification('Kubernetes Node Group scaling command triggered.', 'info');
    } else if (actionKey === 'install_telegram') {
      addNotification('Plugin @rrss-auto/plugin-telegram deployed successfully.', 'success');
    } else if (actionKey === 'create_google_ads_key') {
      createCredential({
        name: 'ai-google-ads-key',
        type: 'API_KEY',
        provider: 'GOOGLE_ADS',
        scope: 'GLOBAL',
        ownerId: 'operator-1',
        plainTextSecret: 'ai-secret-98765-qwerty'
      }).then(() => {
        addNotification('Google Ads API key registered successfully via AI.', 'success');
      }).catch(() => {
        addNotification('Failed to register Google Ads key via AI.', 'error');
      });
    }
  };

  const onlineWorkers = workers.filter(w => w.status === 'ONLINE');
  
  const avgCpu = onlineWorkers.length > 0
    ? onlineWorkers.reduce((acc, w) => acc + (w.cpuUsage ?? 0), 0) / onlineWorkers.length
    : 0;

  const uniquePlugins = new Set<string>();
  workers.forEach(w => {
    if (w.capabilities && typeof w.capabilities === 'object') {
      Object.keys(w.capabilities).forEach(p => uniquePlugins.add(p));
    }
  });
  const installedPluginsCount = uniquePlugins.size;

  const totalCreds = credentials.length;
  const activeCreds = credentials.filter(c => c.status === 'ACTIVE' || c.status === 'active' || c.status === 'Active').length;
  const secretsRotationHealth = totalCreds > 0 ? Math.round((activeCreds / totalCreds) * 100) : 100;

  // Build display workers (without mock fallbacks)
  const displayWorkers = workers.map((w) => ({
    id: w.id,
    status: w.status === 'ONLINE' ? 'Idle' : 'Offline',
    cpu: w.cpuUsage !== undefined && w.cpuUsage !== null ? `${w.cpuUsage.toFixed(1)}%` : 'N/A',
    ram: w.memoryUsage !== undefined && w.memoryUsage !== null ? `${w.memoryUsage.toFixed(1)} GB / 8 GB` : 'N/A',
    region: 'local-pc',
    plugins: w.capabilities && typeof w.capabilities === 'object' 
      ? Object.keys(w.capabilities).join(', ')
      : 'None'
  }));

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div
        className="glass-panel"
        style={{
          width: sidebarCollapsed ? '70px' : 'var(--sidebar-width)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          zIndex: 1000,
        }}
      >
        {/* Brand header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                R
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: 'var(--color-text)' }}>
                RRSS AUTO
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Tenant selectors */}
        {!sidebarCollapsed && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Organization
              </label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="glass-input"
                style={{ width: '100%', fontSize: '12px' }}
              >
                {orgs.map((o) => (
                  <option key={o} value={o} style={{ background: '#1e293b', color: '#fff' }}>{o}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Workspace
              </label>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="glass-input"
                style={{ width: '100%', fontSize: '12px' }}
              >
                {workspaces.length === 0 ? (
                  <option value="Production Enterprise" style={{ background: '#1e293b', color: '#fff' }}>Production Enterprise</option>
                ) : (
                  workspaces.map((w) => (
                    <option key={w.id} value={w.name} style={{ background: '#1e293b', color: '#fff' }}>{w.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}

        {/* Scrollable Navigation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navigationItems.map((item) => {
              const isActive = item.id === activeModule;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    color: isActive ? '#fff' : 'var(--color-text-muted)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s ease',
                  }}
                  title={item.name}
                >
                  <span style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }}>{item.icon}</span>
                  {!sidebarCollapsed && <span style={{ fontSize: '13px' }}>{item.name}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BODY SHELL (Topbar + Content) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* TOP NAV BAR */}
        <div
          className="glass-panel"
          style={{
            height: 'var(--topbar-height)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            zIndex: 900,
          }}
        >
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{selectedOrg}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{selectedWorkspace}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
              {navigationItems.find((n) => n.id === activeModule)?.name}
            </span>
          </div>

          {/* Quick controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search command shortcut trigger */}
            <button
              onClick={toggleCommandPalette}
              className="glass-input"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '180px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              <Search size={14} />
              <span>Search (Ctrl+K)</span>
            </button>

            {/* Notification alert hub */}
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--color-danger)',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </button>
            </div>

            {/* AI ops toggle button */}
            <button
              onClick={toggleAIAssistant}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
              AI Assistant
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
              }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User profile mock */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              AD
            </div>
          </div>
        </div>

        {/* CONTENT LAYOUT WINDOW */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* Active Notifications banner list */}
          {notifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: notif.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${notif.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={16} style={{ color: notif.type === 'success' ? 'var(--color-success)' : 'var(--color-warning)' }} />
                    <span style={{ fontSize: '13px' }}>{notif.message}</span>
                  </div>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* RENDERING INDIVIDUAL DASHBOARDS */}
          {activeModule === 'dashboard' && (
            <div>
              {/* Grid 4 Columns metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Active Workers</div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>
                    {onlineWorkers.length} <span style={{ fontSize: '14px', color: 'var(--color-success)' }}>ONLINE</span>
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>CPU Infrastructure Load</div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>
                    {avgCpu.toFixed(1)}% <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>AVG</span>
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Installed Plugins</div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>
                    {installedPluginsCount} <span style={{ fontSize: '14px', color: 'var(--color-primary)' }}>ACTIVE</span>
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Secrets Rotation health</div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>
                    {secretsRotationHealth}% <span style={{ fontSize: '14px', color: secretsRotationHealth === 100 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {secretsRotationHealth === 100 ? 'SECURE' : 'WARN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 2 Columns dashboards widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>System Overview & Activity</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    Control Center Operating System is fully synchronized with active cloud runtimes and local nodes.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <strong>Active Execution Pipeline:</strong> Google Ads PMax asset updates running on Worker-West-03.
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <strong>Security Policy:</strong> Verification signatures are active. Malicious code payloads will be auto-rejected.
                    </div>
                  </div>
                </div>
                
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Plugin Marketplace Highlights</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span>@rrss-auto/plugin-salesforce</span>
                      <span style={{ color: 'var(--color-primary)' }}>v2.4.0 (Verified)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span>@rrss-auto/plugin-google-ads</span>
                      <span style={{ color: 'var(--color-primary)' }}>v1.1.2 (Verified)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>@rrss-auto/plugin-telegram</span>
                      <span style={{ color: 'var(--color-warning)' }}>Awaiting Approval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'workers' && (
            <div className="glass-card" style={{ padding: '24px', height: '500px' }}>
              <VirtualTable
                data={displayWorkers}
                itemHeight={50}
                containerHeight={400}
                header={
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr 2fr', padding: '12px 16px', fontWeight: 600 }}>
                    <span>Worker ID</span>
                    <span>Status</span>
                    <span>CPU</span>
                    <span>RAM Load</span>
                    <span>Region</span>
                    <span>Active Capabilities</span>
                  </div>
                }
                renderRow={(worker, idx) => (
                  <div
                    key={worker.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr 2fr',
                      padding: '12px 16px',
                      alignItems: 'center',
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{worker.id}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={worker.status === 'Idle' ? 'status-active-pulse' : 'status-dead-pulse'} />
                      {worker.status}
                    </span>
                    <span>{worker.cpu}</span>
                    <span>{worker.ram}</span>
                    <span>{worker.region}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{worker.plugins}</span>
                  </div>
                )}
              />
            </div>
          )}

          {activeModule === 'provisioning' && (
            <div className="glass-card" style={{ padding: '24px', maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '16px' }}>Metadata-Driven Provisioning</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Create physical cloud runtimes or emulators directly from the schema catalog.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Resource Template Type</label>
                  <select className="glass-input">
                    <option>Windows Active Worker node (AWS EC2)</option>
                    <option>Linux Worker Node (Azure VM)</option>
                    <option>Android Virtual Emulator (AVD Core)</option>
                    <option>Puppeteer Browser Engine pool (Docker Compose)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Node Target Name</label>
                  <input type="text" className="glass-input" defaultValue="Worker-East-Custom" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>CPU Cores</label>
                    <input type="number" className="glass-input" defaultValue="4" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>RAM Allocation (GB)</label>
                    <input type="number" className="glass-input" defaultValue="16" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    addNotification('Worker provisioning pipeline initiated in the cloud.', 'success');
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'var(--color-primary)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  Trigger Creation Workflow
                </button>
              </div>
            </div>
          )}

          {activeModule === 'credentials' && (
            <CredentialsPanel />
          )}

          {/* Placeholder for remaining modules */}
          {!['dashboard', 'workers', 'provisioning', 'credentials'].includes(activeModule) && (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
                {navigationItems.find((n) => n.id === activeModule)?.name} Dashboard
              </h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                The architecture for the {navigationItems.find((n) => n.id === activeModule)?.name} module is active and registered. Real-time REST endpoints are bound to the UI layer under the Hexagonal pattern.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* AI ASSISTANT DRAWER PANEL */}
      {aiAssistantOpen && (
        <div
          className="glass-panel"
          style={{
            width: '380px',
            height: '100%',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1100,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: 600, fontSize: '15px' }}>AI Operations Assistant</span>
            </div>
            <button
              onClick={toggleAIAssistant}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat history */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {aiChatLog.map((log, i) => (
              <div
                key={i}
                style={{
                  alignSelf: log.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: log.sender === 'user' ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                    border: log.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    color: '#fff',
                  }}
                >
                  {log.text}
                </div>
                {log.action && (
                  <button
                    onClick={() => handleAiAction(log.action!.actionKey)}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: 'var(--color-success)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    Approve: {log.action.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={handleAiSubmit}
            style={{
              padding: '16px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Ask AI to spin up workers, scale..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="glass-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--color-primary)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
