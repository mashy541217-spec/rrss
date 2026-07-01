import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import {
  Activity, Building2, UserCheck, CreditCard, Award, Radio, 
  Server, Globe2, ShoppingBag, DollarSign, Heart, Terminal, 
  HelpCircle, ToggleLeft, Database, BarChart3, 
  Sun, Moon, Menu, X, Send, Bot, AlertTriangle
} from 'lucide-react';

export const Shell: React.FC = () => {
  const {
    theme, sidebarCollapsed, activeModule, 
    notifications, toggleTheme, setSidebarCollapsed, setActiveModule, 
    toggleAIAssistant,
    aiAssistantOpen, addNotification, clearNotification,
    workers, fetchWorkers, fetchWorkspaces, fetchCredentials
  } = useUIStore();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'assistant'; text: string; action?: { label: string; actionKey: string } }>>([
    { sender: 'assistant', text: 'Welcome to RRSS AUTO Super Admin AI Operations. How can I help orchestrate organizations, licenses, or VM nodes today?' }
  ]);

  // Load backend data dynamically
  useEffect(() => {
    fetchWorkspaces();
    fetchWorkers();
    fetchCredentials();
  }, [fetchWorkspaces, fetchWorkers, fetchCredentials]);

  const navigationItems = [
    { id: 'monitoring', name: 'Platform Monitoring', icon: <Activity size={18} /> },
    { id: 'organizations', name: 'Organizations', icon: <Building2 size={18} /> },
    { id: 'customers', name: 'Customers', icon: <UserCheck size={18} /> },
    { id: 'subscriptions', name: 'Subscriptions', icon: <CreditCard size={18} /> },
    { id: 'licenses', name: 'Licenses', icon: <Award size={18} /> },
    { id: 'workers', name: 'Workers', icon: <Radio size={18} /> },
    { id: 'vms', name: 'VMs', icon: <Server size={18} /> },
    { id: 'proxies', name: 'Proxies', icon: <Globe2 size={18} /> },
    { id: 'marketplace', name: 'Marketplace', icon: <ShoppingBag size={18} /> },
    { id: 'billing', name: 'Billing', icon: <DollarSign size={18} /> },
    { id: 'health', name: 'Health', icon: <Heart size={18} /> },
    { id: 'logs', name: 'Logs', icon: <Terminal size={18} /> },
    { id: 'support', name: 'Support', icon: <HelpCircle size={18} /> },
    { id: 'featureflags', name: 'Feature Flags', icon: <ToggleLeft size={18} /> },
    { id: 'infrastructure', name: 'Infrastructure', icon: <Database size={18} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={18} /> }
  ];

  // Sync initial module if it is not in the list
  useEffect(() => {
    if (!navigationItems.find(item => item.id === activeModule)) {
      setActiveModule('monitoring');
    }
  }, [activeModule, setActiveModule]);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt.trim();
    setAiChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    setTimeout(() => {
      let replyText = "I don't understand that command. Try asking 'List active VMs' or 'Check proxy target health'.";
      let action = undefined;

      if (userMsg.toLowerCase().includes('vm') || userMsg.toLowerCase().includes('virtual')) {
        replyText = "Parsed Intent: ORCHESTRATE_VIRTUAL_MACHINES. I see 4 active hypervisors hosting 12 virtual nodes. I can scale up the proxy host vm pool:";
        action = { label: 'Scale VM Pool +2', actionKey: 'scale_vms' };
      } else if (userMsg.toLowerCase().includes('proxy') || userMsg.toLowerCase().includes('rotator')) {
        replyText = "Parsed Intent: ROTATE_PROXIES. 2 proxy rotators are returning high latency (>400ms). I recommend purging blacklisted target routes:";
        action = { label: 'Optimize Proxy Slugs', actionKey: 'optimize_proxies' };
      } else if (userMsg.toLowerCase().includes('license') || userMsg.toLowerCase().includes('seat')) {
        replyText = "Parsed Intent: SYSTEM_LICENSING. Client 'Acme Corp' is at 95% seat capacity. I can issue a temporary license extension:";
        action = { label: 'Extend Acme Seats', actionKey: 'extend_acme_license' };
      }

      setAiChatLog((prev) => [...prev, { sender: 'assistant', text: replyText, action }]);
    }, 1000);
  };

  const handleAiAction = (actionKey: string) => {
    if (actionKey === 'scale_vms') {
      addNotification('Orchestrator: Deployed 2 new VM host layers.', 'success');
    } else if (actionKey === 'optimize_proxies') {
      addNotification('Proxy Manager: Latencies normalized under 120ms.', 'success');
    } else if (actionKey === 'extend_acme_license') {
      addNotification('License vault: Extended Acme seats limit temporarily.', 'info');
    }
  };

  // 16 Premium Panel render functions
  const renderPanelContent = () => {
    switch (activeModule) {
      case 'monitoring':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Active Hypervisors</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>12 / 16</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>All systems nominal</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>IP Proxy Latency</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>94 ms</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>Optimal rotator routing</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Worker Nodes Load</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>{workers.length} Nodes</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>Concurrency peak under 42%</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Active SLA Health</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>99.98%</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>Monthly goal exceeded</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '16px' }}>Core VM Node Clusters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['cluster-us-east-1', 'cluster-eu-west-3', 'cluster-sa-east-1'].map((c, i) => (
                  <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <span>{c}</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active - {8 + i * 2} VM instances</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'organizations':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Organizations Directory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <th style={{ padding: '12px 8px' }}>Org Name</th>
                  <th>ID</th>
                  <th>Total Workspaces</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {['Acme Corp', 'Deloitte Partner Hub', 'Marketing Global Co.'].map((o, idx) => (
                  <tr key={o} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{o}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>org-{1000 + idx}</td>
                    <td>{3 + idx}</td>
                    <td><span style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'customers':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Customer Directory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>Customer Account</th>
                  <th>Email</th>
                  <th>Organization Link</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@acme.com', org: 'Acme Corp' },
                  { name: 'Alice Smith', email: 'alice@deloitte.com', org: 'Deloitte Partner Hub' }
                ].map((c) => (
                  <tr key={c.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{c.email}</td>
                    <td>{c.org}</td>
                    <td><span style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: '4px', fontSize: '11px' }}>Verified</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Client Subscription Tiers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { plan: 'Growth', count: '14 accounts', price: '$299/mo' },
                { plan: 'Enterprise Platform', count: '48 accounts', price: '$1,299/mo' },
                { plan: 'Scale Scale Plus', count: '12 accounts', price: '$3,499/mo' }
              ].map((s) => (
                <div key={s.plan} className="glass-card" style={{ padding: '20px' }}>
                  <strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>{s.plan}</strong>
                  <div style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0' }}>{s.count}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Baseline rate: {s.price}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'licenses':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Active Enterprise Licenses</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>Key ID</th>
                  <th>Holder Entity</th>
                  <th>Seat Tally</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'lic-8898-acme', entity: 'Acme Corp', seats: '50 Seats', exp: '2027-12-31' },
                  { key: 'lic-1224-delo', entity: 'Deloitte Partners', seats: '250 Seats', exp: '2028-06-15' }
                ].map((l) => (
                  <tr key={l.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{l.key}</td>
                    <td>{l.entity}</td>
                    <td>{l.seats}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{l.exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'workers':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '16px' }}>Worker Daemon Nodes</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 8px' }}>Host</th>
                    <th>Status</th>
                    <th>Concurrency limit</th>
                    <th>Active jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 600 }}>{w.hostname}</td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: w.status === 'ONLINE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: w.status === 'ONLINE' ? 'var(--color-success)' : 'var(--color-danger)'
                        }}>{w.status}</span>
                      </td>
                      <td>{w.concurrencyLimit} Parallel jobs</td>
                      <td>{w.activeJobCount} Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'vms':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>VM Orchestrator Node Pools</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>VM ID</th>
                  <th>Compute Power</th>
                  <th>Orchestrator Host</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'vm-node-01', spec: '4 vCPU / 16 GB RAM', host: 'hypervisor-us-01' },
                  { id: 'vm-node-02', spec: '8 vCPU / 32 GB RAM', host: 'hypervisor-us-01' },
                  { id: 'vm-node-03', spec: '2 vCPU / 8 GB RAM', host: 'hypervisor-eu-02' }
                ].map((vm) => (
                  <tr key={vm.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{vm.id}</td>
                    <td>{vm.spec}</td>
                    <td>{vm.host}</td>
                    <td><span style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: '4px', fontSize: '11px' }}>Provisioned</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'proxies':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>IP Proxy Rotation Groups</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>IP Rotator Address</th>
                  <th>Region / Target</th>
                  <th>Failure Index</th>
                  <th>Avg Response</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ip: '185.190.220.12:4400', target: 'US Residential', fails: '0.00%', ping: '92ms' },
                  { ip: '194.22.18.232:4400', target: 'EU Residential', fails: '0.12%', ping: '114ms' }
                ].map((p) => (
                  <tr key={p.ip} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{p.ip}</td>
                    <td>{p.target}</td>
                    <td style={{ color: 'var(--color-success)' }}>{p.fails}</td>
                    <td style={{ fontWeight: 600 }}>{p.ping}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'marketplace':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Administrative Marketplace Hub</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { name: 'Instagram Publisher v2', category: 'Official Plugin', stats: 'Used by 24 orgs' },
                { name: 'WhatsApp Business Connector', category: 'Enterprise SDK', stats: 'Used by 12 orgs' },
                { name: 'Monday.com Integration Flow', category: 'Community Hook', stats: 'Awaiting review' }
              ].map((m) => (
                <div key={m.name} className="glass-card" style={{ padding: '20px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>{m.category}</span>
                  <h4 style={{ margin: '8px 0', fontSize: '15px' }}>{m.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.stats}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Central Billing Ledger Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>Reference</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Audit Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: 'inv-29938-acme', client: 'Acme Corp', val: '$1,299.00', date: '2026-06-25' },
                  { ref: 'inv-29939-delo', client: 'Deloitte Partner Hub', val: '$3,499.00', date: '2026-06-26' }
                ].map((b) => (
                  <tr key={b.ref} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{b.ref}</td>
                    <td>{b.client}</td>
                    <td style={{ fontWeight: 600 }}>{b.val}</td>
                    <td>{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'health':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Service Dependencies SLA Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { srv: 'Orchestrator Hypervisors (VMWare / AWS)', status: 'Nominal', sla: '99.99%' },
                { srv: 'Database Replica Clusters (PostgreSQL)', status: 'Nominal', sla: '99.98%' },
                { srv: 'Proxy Rotators Gateway Nodes', status: 'Healthy', sla: '100.00%' }
              ].map((h) => (
                <div key={h.srv} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span>{h.srv}</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{h.status}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{h.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Platform Activity Logs</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#10b981', maxHeight: '300px', overflowY: 'auto' }}>
              <div>[2026-06-27 18:24:02] INFO: Scaling VM cluster us-east-1 (scale state 12 to 14)</div>
              <div>[2026-06-27 18:24:14] WARN: Proxy IP 185.190.220.12 threshold warning (ping 404ms)</div>
              <div>[2026-06-27 18:24:25] INFO: Successfully compiled user credentials validation cache</div>
              <div>[2026-06-27 18:24:32] SUCCESS: All cron scheduler worker queues report nominal status</div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Enterprise Support Tickets</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 8px' }}>Ticket</th>
                  <th>Sender Organization</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'tkt-4001', org: 'Deloitte', t: 'Unable to provision Linux worker node', p: 'HIGH' },
                  { id: 'tkt-4002', org: 'Acme Corp', t: 'Request for temporary seat boost', p: 'MEDIUM' }
                ].map((tkt) => (
                  <tr key={tkt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{tkt.id}: {tkt.t}</td>
                    <td>{tkt.org}</td>
                    <td><span style={{ color: tkt.p === 'HIGH' ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 600 }}>{tkt.p}</span></td>
                    <td><button className="btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }}>Respond</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'featureflags':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Feature Toggles & Flags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Enable AI Caption Autocomplete', detail: 'Controls OpenAI execution access hooks', enabled: true },
                { name: 'Multi-Tenant Sandbox Vault Routing', detail: 'Redirects API keys authentication to isolated vaults', enabled: true },
                { name: 'Enterprise WhatsApp Campaign Pilot', detail: 'Grants access to meta-sdk business API nodes', enabled: false }
              ].map((flag) => (
                <div key={flag.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div>
                    <strong>{flag.name}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{flag.detail}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: flag.enabled ? 'var(--color-success)' : 'var(--color-text-muted)' }}>{flag.enabled ? 'Enabled' : 'Disabled'}</span>
                    <input type="checkbox" defaultChecked={flag.enabled} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'infrastructure':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Database & Storage Backends</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <strong>PostgreSQL DB Replica Cluster</strong>
                <div style={{ margin: '12px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>Active pools: 12 replica connections</div>
                <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active - SLA nominal</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <strong>Redis Cache Store</strong>
                <div style={{ margin: '12px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>Eviction index: 0.00% / HIT: 98.4%</div>
                <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active - Memory cleared</div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>SaaS Signup Performance Charts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>New Signups This Month</div>
                <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>1,294</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>+14.2% Growth</div>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Monthly Recurring Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>$42,880</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>+8.4% Growth</div>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Churn Index</div>
                <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>1.04%</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>Below target ceiling</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
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

        {/* Admin context marker banner */}
        {!sidebarCollapsed && (
          <div style={{ padding: '16px 20px 0 20px' }}>
            <span style={{ fontSize: '10px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, letterSpacing: '0.5px' }}>
              Super Admin Gateway
            </span>
          </div>
        )}

        {/* Scrollable Navigation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
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
            <span style={{ color: 'var(--color-text-muted)' }}>Staff portal</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
              {navigationItems.find((n) => n.id === activeModule)?.name}
            </span>
          </div>

          {/* Quick controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
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
              <Bot size={14} style={{ color: 'var(--color-primary)' }} />
              SuperOps AI
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

            {/* User profile */}
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

          {renderPanelContent()}

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
              placeholder="Ask AI to scale VMs, verify proxies..."
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
