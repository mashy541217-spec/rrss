import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Sparkles, Activity, FileText, Share2, CheckCircle2, ChevronRight, ScanLine } from 'lucide-react';

export const AIBusinessAnalysis: React.FC = () => {
  const { nextStep } = useWorkspaceStore();
  const [phase, setPhase] = useState(0);

  const phases = [
    { title: 'Scanning Industry Data...', icon: <Activity size={20} /> },
    { title: 'Analyzing Competitors...', icon: <ScanLine size={20} /> },
    { title: 'Generating Content Pillars...', icon: <FileText size={20} /> },
    { title: 'Building Social Strategies...', icon: <Share2 size={20} /> },
    { title: 'AI Copilot Ready', icon: <CheckCircle2 size={20} /> }
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setPhase(current);
      if (current >= phases.length - 1) {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px', padding: '20px 0' }}>
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          marginBottom: '20px'
        }}>
          <Sparkles size={32} color="#fff" />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>AI Business Analysis</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '15px', maxWidth: '400px' }}>
          Our AI is scanning your industry template and connected channels to generate initial recommendations.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '360px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {phases.map((p, idx) => {
            const isActive = phase === idx;
            const isDone = phase > idx;
            
            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: isDone ? 1 : isActive ? 1 : 0.3,
                transition: 'all 0.3s'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone ? 'rgba(16,185,129,0.1)' : isActive ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                  color: isDone ? '#10b981' : isActive ? '#3b82f6' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isDone ? <CheckCircle2 size={18} /> : p.icon}
                </div>
                <span style={{
                  fontSize: '15px',
                  fontWeight: isActive || isDone ? 600 : 400,
                  color: isActive || isDone ? '#fff' : 'var(--color-text-muted)'
                }}>
                  {p.title}
                </span>
                {isActive && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <div className="dot-flashing" style={{ width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', animation: 'flash 1s infinite alternate' }} />
                    <div className="dot-flashing" style={{ width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', animation: 'flash 1s infinite alternate 0.2s' }} />
                    <div className="dot-flashing" style={{ width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', animation: 'flash 1s infinite alternate 0.4s' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          type="submit"
          disabled={phase < phases.length - 1}
          className="btn-primary"
          style={{
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: 600,
            opacity: phase < phases.length - 1 ? 0.5 : 1,
            cursor: phase < phases.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {phase < phases.length - 1 ? 'Analyzing...' : 'View My Workspace'} <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes flash {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>
    </form>
  );
};
