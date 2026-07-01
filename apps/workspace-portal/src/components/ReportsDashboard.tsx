import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { FileText, Plus, Download, Clock, Star, Trash2 } from 'lucide-react';

interface ReportsDashboardProps {
  onNewReport: () => void;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ onNewReport }) => {
  const { activeBusinessId, reports, deleteReport } = useWorkspaceStore();

  const businessReports = reports.filter(r => r.businessId === activeBusinessId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Reports Center</h2>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Business Intelligence & Export Management</p>
        </div>
        <button className="btn-primary" onClick={onNewReport} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={16} /> Create Report
        </button>
      </div>

      {/* AI Insights Ribbon */}
      <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}>
          <Star size={16} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>AI Observation</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Your engagement increased by 18% this week. Instagram Reels generated 42% more reach than static posts.</div>
        </div>
        <button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>Generate Insights Report</button>
      </div>

      {/* Quick Navigation Tabs (Visual only for now) */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
        {[
          { label: 'Recent', active: true },
          { label: 'Scheduled', active: false },
          { label: 'Shared', active: false },
          { label: 'Templates', active: false }
        ].map(tab => (
          <button key={tab.label} style={{ 
            background: tab.active ? 'var(--color-primary)' : 'transparent',
            color: tab.active ? '#fff' : 'var(--color-text-muted)',
            border: 'none', padding: '6px 16px', borderRadius: '16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {businessReports.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', minHeight: '300px' }}>
          <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>No Reports Generated</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>Create your first custom report to analyze performance.</p>
          <button className="btn-secondary" onClick={onNewReport}>Create Report</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {businessReports.map(report => (
            <div key={report.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
                    <FileText size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{report.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Clock size={12} /> {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                  {report.status}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><strong>Range:</strong> {report.dateRange}</div>
                <div><strong>Format:</strong> {report.exportFormat}</div>
                <div><strong>Channels:</strong> {report.channels.length}</div>
                <div><strong>Metrics:</strong> {report.metrics.length}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                <button className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px' }}>
                  <Download size={14} /> Download
                </button>
                <button onClick={() => deleteReport(report.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', border: 'none', borderRadius: '8px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
