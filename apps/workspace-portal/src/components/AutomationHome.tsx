import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, Search, Sparkles, Workflow, Clock, LayoutTemplate, MoreVertical } from 'lucide-react';
import { AutomationVisualBuilder } from './AutomationVisualBuilder';

export const AutomationHome: React.FC = () => {
  const { activeBusinessId, automations } = useWorkspaceStore();
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderMode, setBuilderMode] = useState<'blank' | 'ai' | 'template'>('blank');

  const businessAutos = automations.filter(a => a.businessId === activeBusinessId);

  if (showBuilder) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 9999 }}>
        <AutomationVisualBuilder mode={builderMode} onClose={() => setShowBuilder(false)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Workflow size={24} color="var(--color-primary)" /> Automations
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => { setBuilderMode('template'); setShowBuilder(true); }}>
            <LayoutTemplate size={14} /> Templates
          </button>
          <button className="btn-primary" onClick={() => { setBuilderMode('blank'); setShowBuilder(true); }}>
            <Plus size={14} /> Create Automation
          </button>
        </div>
      </div>

      {/* AI Wizard Banner */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-primary)" /> Create with AI
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Describe what you want to automate in plain English, and the Workspace OS will build the workflow for you.
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ background: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => { setBuilderMode('ai'); setShowBuilder(true); }}
        >
          <Sparkles size={14} /> Generate Workflow
        </button>
      </div>

      {/* Automation List */}
      <div className="glass-panel" style={{ flex: 1, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>My Automations</h3>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search..." className="glass-input" style={{ paddingLeft: '30px', fontSize: '13px' }} />
          </div>
        </div>

        {businessAutos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Workflow size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>No automations configured yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {businessAutos.map(auto => (
              <div key={auto.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Workflow size={16} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{auto.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {auto.status} • {auto.nodes.length} steps
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ padding: '4px' }}><MoreVertical size={14} /></button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Last run: {auto.lastRun ? new Date(auto.lastRun).toLocaleDateString() : 'Never'}
                  </div>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '11px' }}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
