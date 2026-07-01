import React, { useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Rocket, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelcomeExperience: React.FC = () => {
  const { completeOnboarding, workspaceName } = useWorkspaceStore();

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', padding: '40px 20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #6d28d9 100%)',
        boxShadow: '0 0 40px var(--glow-primary)',
        marginBottom: '16px'
      }}>
        <Rocket size={40} color="#fff" />
      </div>

      <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>
        You're all set!
      </h1>
      
      <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', maxWidth: '450px', lineHeight: '1.6', margin: 0 }}>
        Welcome to <strong>{workspaceName || 'your new workspace'}</strong>. 
        Your environment has been fully configured with industry templates, AI workflows, and social integrations.
      </p>

      <button
        onClick={handleComplete}
        className="btn-primary"
        style={{
          marginTop: '24px',
          padding: '16px 40px',
          fontSize: '16px',
          fontWeight: 700,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px var(--glow-primary)',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Enter Workspace OS <ArrowRight size={20} />
      </button>
    </div>
  );
};
