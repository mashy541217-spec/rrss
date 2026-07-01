import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Github, Chrome, Apple, Terminal, CheckCircle2 } from 'lucide-react';

export const AuthGate: React.FC = () => {
  const { login, signup, authMode, setAuthMode } = useWorkspaceStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      if (useMagicLink) {
        await signup(email, 'magic-link-placeholder-password');
      } else {
        if (authMode === 'login') {
          await login(email, password);
        } else {
          await signup(email, password);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSimulate = (provider: string) => {
    setLoading(true);
    setTimeout(async () => {
      await login(`${provider.toLowerCase()}@oauth-sandbox.com`, 'oauth-token');
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#fff',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Left Panel: Auth Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(9, 13, 22, 1)'
      }}>
        {/* Background ambient light bubbles */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Brand/Logo header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #6d28d9 100%)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                <ShieldCheck size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>RRSS AUTO</span>
            </div>
            
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px', lineHeight: '1.2' }}>
              {authMode === 'login' ? 'Welcome back to your workspace.' : 'Start your enterprise automation journey.'}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
              {authMode === 'login' ? 'Enter your details to securely access your centralized platform.' : 'Create an account to build your centralized operating system.'}
            </p>
          </div>

          {/* Tab switcher */}
          {!useMagicLink && (
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '32px'
            }}>
              <button
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: authMode === 'login' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: authMode === 'login' ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: authMode === 'login' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: authMode === 'signup' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: authMode === 'signup' ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: authMode === 'signup' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Main form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  required
                  className="glass-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            {!useMagicLink && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Password
                  </label>
                  {authMode === 'login' && (
                    <span style={{ fontSize: '13px', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}>
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    required
                    className="glass-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', fontSize: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                padding: '16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span>Connecting Secure Gate...</span>
              ) : useMagicLink ? (
                <>Send Magic Link <ArrowRight size={18} /></>
              ) : authMode === 'login' ? (
                <>Sign In <LogIn size={18} /></>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Toggle between Magic Link / standard form */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setUseMagicLink(!useMagicLink)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {useMagicLink ? 'Use email and password instead' : 'Prefer magic link? Log in without password'}
            </button>
          </div>

          {/* OAuth Separator */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', opacity: 0.8 }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', padding: '0 16px', fontWeight: 500 }}>
              Or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Social buttons grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <button
              onClick={() => handleOAuthSimulate('Google')}
              title="Authenticate with Google"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <Chrome size={20} />
            </button>
            <button
              onClick={() => handleOAuthSimulate('Microsoft')}
              title="Authenticate with Microsoft"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <Terminal size={20} />
            </button>
            <button
              onClick={() => handleOAuthSimulate('Apple')}
              title="Authenticate with Apple"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <Apple size={20} />
            </button>
            <button
              onClick={() => handleOAuthSimulate('GitHub')}
              title="Authenticate with GitHub"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <Github size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Hero / Promotional */}
      <div style={{
        flex: '1.2',
        position: 'relative',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        {/* Abstract background graphics */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Feature Highlights */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '540px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(139, 92, 246, 0.2)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            marginBottom: '32px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 10px #a78bfa' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.5px' }}>Workspace OS v14.1 is live</span>
          </div>

          <h2 style={{ fontSize: '48px', fontWeight: 800, lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1.5px', background: 'linear-gradient(180deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            The Operating System for Modern Businesses.
          </h2>
          
          <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '48px' }}>
            Replace 10 different tools with a single unified workspace. Manage social channels, launch campaigns, track analytics, and automate tasks using native AI capabilities.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              'Connect multiple brands in isolated environments',
              'Visual automation builder & custom schedulers',
              'AI Copilot for content and recommendations'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--color-success)',
                  marginTop: '2px'
                }}>
                  <CheckCircle2 size={16} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#f1f5f9', lineHeight: '1.5' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Testimonial / Social Proof */}
          <div style={{ marginTop: '64px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: '15px', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.5' }}>
              "RRSS AUTO consolidated our entire marketing stack. The visual automations and multi-brand workspace saved us hundreds of hours in the first month alone."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                SD
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>Sarah Danvers</strong>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Marketing Director, TechFlow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
