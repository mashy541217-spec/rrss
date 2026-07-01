import React from 'react';
import { HeartPulse, Cpu, Thermometer, ShieldAlert, CheckCircle2, TrendingUp, Clock } from 'lucide-react';

export const ProductHealth: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-success)' }}>
              <HeartPulse size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Product Health</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Live telemetry, stability metrics, and system performance.</p>
            </div>
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 2s infinite' }} />
            All Systems Operational
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Workspace Stability */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} /> Workspace Stability
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-success)', lineHeight: 1 }}>99.98%</span>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>uptime (30d)</span>
          </div>
          <div style={{ marginTop: '24px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '99%', background: 'var(--color-success)' }} />
            <div style={{ width: '1%', background: 'var(--color-danger)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            <span>Last incident: 14 days ago</span>
            <span>Target: 99.99%</span>
          </div>
        </div>

        {/* Performance (TTI) */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} /> App Performance
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>0.8s</span>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Avg Time to Interactive</span>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>First Contentful Paint</span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>0.4s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>API Latency (p95)</span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>120ms</span>
            </div>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={18} /> User Satisfaction
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-warning)', lineHeight: 1 }}>82</span>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>NPS Score</span>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '2px', height: '24px' }}>
            <div style={{ flex: 15, background: 'var(--color-danger)', borderRadius: '4px 0 0 4px' }} title="15% Detractors" />
            <div style={{ flex: 20, background: 'rgba(255,255,255,0.2)' }} title="20% Passives" />
            <div style={{ flex: 65, background: 'var(--color-success)', borderRadius: '0 4px 4px 0' }} title="65% Promoters" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            <span>Based on 1,240 feedback surveys</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0' }}>Architecture Readiness (Telemetry & Session Replay)</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
          Data models and telemetry interceptors have been prepared for internal events. Third-party analytic providers (Datadog, PostHog, Sentry) are mocked and ready for integration post-beta.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Crash Analytics', status: 'Ready (Mocked)', icon: <ShieldAlert size={16} /> },
            { title: 'Navigation Telemetry', status: 'Intercepting', icon: <TrendingUp size={16} /> },
            { title: 'Session Replay', status: 'Architecture Only', icon: <Clock size={16} /> },
            { title: 'Feature Usage Metrics', status: 'Ready (Mocked)', icon: <CheckCircle2 size={16} /> },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                {item.icon} {item.title}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
