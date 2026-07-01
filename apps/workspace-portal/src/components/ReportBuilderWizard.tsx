import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { 
  X, Check, FileText, Calendar as CalendarIcon, Filter, 
  BarChart2, Eye, Download, ArrowRight, ArrowLeft
} from 'lucide-react';

interface ReportBuilderWizardProps {
  onClose: () => void;
}

const REPORT_TYPES = ['Executive Summary', 'Campaign Report', 'Automation Report', 'Social Performance Report', 'Content Performance', 'Monthly Business Report', 'Custom Report'];
const DATE_RANGES = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom'];
const CHANNELS = ['Instagram', 'Facebook', 'Threads', 'Messenger', 'TikTok', 'Pinterest', 'LinkedIn', 'YouTube', 'Google Business', 'Google Ads', 'Meta Ads', 'WhatsApp Business'];
const METRICS = ['Reach', 'Impressions', 'Followers', 'Engagement', 'CTR', 'Clicks', 'Conversions', 'Revenue', 'ROI', 'Automation Success', 'Campaign Success', 'Publishing Frequency', 'AI Score', 'Business Health'];
const EXPORTS = ['PDF', 'Excel', 'CSV', 'PowerPoint', 'Email Delivery', 'Scheduled Reports', 'Share Link', 'Print'];

export const ReportBuilderWizard: React.FC<ReportBuilderWizardProps> = ({ onClose }) => {
  const { generateReport } = useWorkspaceStore();
  
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState('Executive Summary');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('PDF');

  const toggleArrayItem = (setter: any, array: string[], item: string) => {
    setter(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
  };

  const handleExport = () => {
    generateReport({
      type: reportType,
      dateRange,
      channels: selectedChannels.length > 0 ? selectedChannels : ['All Channels'],
      metrics: selectedMetrics.length > 0 ? selectedMetrics : ['Overview Metrics'],
      exportFormat
    });
    onClose();
  };

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
      {[1,2,3,4,5,6].map(s => (
        <div key={s} style={{ 
          flex: 1, height: '4px', borderRadius: '2px',
          background: s <= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'
        }} />
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel" style={{ width: '800px', height: '600px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Report Builder</h2>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Step {step} of 6</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
          {renderStepIndicator()}
          
          {step === 1 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><FileText size={18} /> Choose Report Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {REPORT_TYPES.map(type => (
                  <button key={type} onClick={() => setReportType(type)} className={reportType === type ? 'btn-primary' : 'btn-secondary'} style={{ padding: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                    {type} {reportType === type && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><CalendarIcon size={18} /> Choose Date Range</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {DATE_RANGES.map(range => (
                  <button key={range} onClick={() => setDateRange(range)} className={dateRange === range ? 'btn-primary' : 'btn-secondary'} style={{ padding: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                    {range} {dateRange === range && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><Filter size={18} /> Choose Channels</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {CHANNELS.map(ch => (
                  <button key={ch} onClick={() => toggleArrayItem(setSelectedChannels, selectedChannels, ch)} className={selectedChannels.includes(ch) ? 'btn-primary' : 'btn-secondary'} style={{ padding: '12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    {ch} {selectedChannels.includes(ch) && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><BarChart2 size={18} /> Choose Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {METRICS.map(m => (
                  <button key={m} onClick={() => toggleArrayItem(setSelectedMetrics, selectedMetrics, m)} className={selectedMetrics.includes(m) ? 'btn-primary' : 'btn-secondary'} style={{ padding: '12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    {m} {selectedMetrics.includes(m) && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><Eye size={18} /> Preview Report</h3>
              <div className="glass-card" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 4px 0' }}>{reportType}</h2>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{dateRange}</div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Mock Chart</div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Mock Chart</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Mock Table Data</div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}><Download size={18} /> Choose Export Format</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {EXPORTS.map(exp => (
                  <button key={exp} onClick={() => setExportFormat(exp)} className={exportFormat === exp ? 'btn-primary' : 'btn-secondary'} style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {exportFormat === exp && <Check size={16} />}
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            style={{ visibility: step === 1 ? 'hidden' : 'visible', display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          {step < 6 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleExport} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--color-success)' }}>
              Export Report <Download size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
