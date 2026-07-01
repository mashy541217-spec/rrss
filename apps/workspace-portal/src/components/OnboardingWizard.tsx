import React, { useState } from 'react';
import { Building2, Layers, Briefcase, CheckCircle2, ChevronRight, ChevronLeft, Mail, Image as ImageIcon, MapPin, Share2, Sparkles, Rocket } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { SmartConnectionWizard } from './SmartConnectionWizard';
import { AIBusinessAnalysis } from './AIBusinessAnalysis';
import { WelcomeExperience } from './WelcomeExperience';

export const OnboardingWizard: React.FC = () => {
  const {
    currentStep, organizationName,
    nextStep, prevStep, setOrganizationName, createWorkspace, addBusiness,
    setBrandColor
  } = useWorkspaceStore();

  // Verification Code state
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Step 4 Workspace Inputs
  const [wsName, setWsName] = useState('');
  const [wsSlug, setWsSlug] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  
  // Step 5 Business Profile Inputs
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');

  // Step 6 Industry Selection
  const [selectedIndustry, setSelectedIndustry] = useState('marketing-agency');

  const handleVerifyCodeChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = verifyCode.join('');
    if (codeString.length !== 6) return;

    setVerifying(true);
    setVerifyError('');

    setTimeout(() => {
      if (codeString === '123456' || codeString.length === 6) {
        setVerifying(false);
        nextStep();
      } else {
        setVerifying(false);
        setVerifyError('Invalid verification code. Try "123456" for sandbox testing.');
      }
    }, 800);
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) return;
    nextStep();
  };

  const handleWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim() || !wsSlug.trim()) return;
    await createWorkspace({
      name: wsName,
      slug: wsSlug,
      timezone: 'America/New_York',
      locale: 'en-US'
    });
    setBusinessName(`${wsName} Operations`);
    nextStep();
  };
  
  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setBrandColor(selectedColor);
    nextStep();
  };

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const industryName = selectedIndustry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    await addBusiness(businessName, industryName);
    nextStep();
  };

  const stepsList = [
    { num: 1, name: 'Account', icon: <CheckCircle2 size={15} /> },
    { num: 2, name: 'Verify', icon: <Mail size={15} /> },
    { num: 3, name: 'Organization', icon: <Building2 size={15} /> },
    { num: 4, name: 'Workspace', icon: <Layers size={15} /> },
    { num: 5, name: 'Profile', icon: <ImageIcon size={15} /> },
    { num: 6, name: 'Industry', icon: <Briefcase size={15} /> },
    { num: 7, name: 'Connect', icon: <Share2 size={15} /> },
    { num: 8, name: 'AI Scan', icon: <Sparkles size={15} /> },
    { num: 9, name: 'Ready', icon: <Rocket size={15} /> }
  ];

  const industries = [
    { id: 'marketing-agency', title: 'Marketing Agency', desc: 'Multi-tenant calendars, workflows & analytics.' },
    { id: 'ecommerce', title: 'E-Commerce & Retail', desc: 'Product catalogs, promos, & automated responses.' },
    { id: 'restaurant', title: 'Restaurant & Food', desc: 'Menus, reviews, & local SEO publishing.' },
    { id: 'tech-saas', title: 'Technology & SaaS', desc: 'Release updates & customer support.' },
    { id: 'influencer', title: 'Influencer & Brand', desc: 'Media kits, engagement charts & posting.' },
    { id: 'freelancer', title: 'Freelancer', desc: 'Portfolios, updates, & outbound prospects.' },
    { id: 'real-estate', title: 'Real Estate', desc: 'Property listings, open houses & local reach.' },
    { id: 'healthcare', title: 'Healthcare', desc: 'Patient info, appointments & health tips.' },
    { id: 'education', title: 'Education', desc: 'Course promos, alumni updates & events.' },
    { id: 'non-profit', title: 'Non-Profit & NGO', desc: 'Fundraising, volunteer drives & impact.' },
    { id: 'automotive', title: 'Automotive', desc: 'Inventory showcases & service specials.' },
    { id: 'beauty-wellness', title: 'Beauty & Wellness', desc: 'Booking, before-and-afters & tips.' },
    { id: 'finance', title: 'Finance & Accounting', desc: 'Tax tips, market updates & trust building.' },
    { id: 'legal', title: 'Legal Services', desc: 'Case studies, compliance & consultation.' },
    { id: 'travel', title: 'Travel & Tourism', desc: 'Destinations, bookings & customer reviews.' },
    { id: 'event-planning', title: 'Event Planning', desc: 'Schedules, recaps & ticket sales.' },
    { id: 'photography', title: 'Photography', desc: 'Galleries, behind-the-scenes & bookings.' },
    { id: 'fitness', title: 'Fitness & Sports', desc: 'Class schedules, workout videos & merch.' },
    { id: 'architecture', title: 'Architecture & Design', desc: 'Project showcases & interior trends.' },
    { id: 'music', title: 'Entertainment', desc: 'Tour dates, ticket links & new releases.' },
    { id: 'logistics', title: 'Logistics & Supply', desc: 'B2B updates, routes & partnerships.' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1) 0%, rgba(9, 13, 22, 1) 70%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#fff',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '850px' }}>
        
        {/* Horizontal steps header progress bar */}
        <div className="glass-panel" style={{
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.05)',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {stepsList.map((step) => {
            const isActive = step.num === currentStep;
            const isDone = step.num < currentStep;
            return (
              <div key={step.num} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isActive || isDone ? 1 : 0.35,
                transition: 'all 0.3s',
                minWidth: '85px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isDone ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '11px',
                  boxShadow: isActive ? '0 0 15px var(--glow-primary)' : 'none'
                }}>
                  {isDone ? <CheckCircle2 size={14} /> : step.num}
                </div>
                <span style={{ fontSize: '12px', fontWeight: isActive ? 700 : 400, color: isActive ? '#fff' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Steps contents container panel */}
        <div className="glass-panel" style={{
          borderRadius: '24px',
          padding: '48px',
          minHeight: '440px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>

          {/* STEP 2: VERIFY EMAIL */}
          {currentStep === 2 && (
            <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Security Verification</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Verify your email address</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
                  We have sent a 6-digit confirmation code to your email. Enter it below to unlock your registration flow.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0' }}>
                  {verifyCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`code-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleVerifyCodeChange(idx, e.target.value)}
                      className="glass-input"
                      style={{
                        width: '56px',
                        height: '64px',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 700,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
                {verifyError && (
                  <div style={{ color: 'var(--color-danger)', fontSize: '13px', textAlign: 'center', marginTop: '12px', fontWeight: 500 }}>
                    {verifyError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  Didn't receive the email? <span style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Resend code</span>
                </span>
                <button type="submit" disabled={verifying} className="btn-primary" style={{ padding: '12px 28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {verifying ? 'Verifying...' : <>Verify Email <ChevronRight size={16} /></>}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CREATE ORGANIZATION */}
          {currentStep === 3 && (
            <form onSubmit={handleOrgSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Step 3 of 9</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Name your Organization</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
                  Organizations are the umbrella structure that manage multiple workspaces, teams, and billing configurations.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text-muted)' }}>Organization Name</label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  placeholder="e.g. Acme Corporation"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  style={{ fontSize: '15px', padding: '14px', borderRadius: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CREATE WORKSPACE */}
          {currentStep === 4 && (
            <form onSubmit={handleWorkspaceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Step 4 of 9</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Create Workspace Hub</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
                  Workspaces group different business entities, social channels, and automations together.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px' }}>Workspace Name</label>
                  <input type="text" required placeholder="e.g. LATAM Marketing" className="glass-input" value={wsName} onChange={(e) => setWsName(e.target.value)} style={{ padding: '12px', borderRadius: '10px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px' }}>Workspace URL Slug</label>
                  <input type="text" required placeholder="e.g. latam-mkt" className="glass-input" value={wsSlug} onChange={(e) => setWsSlug(e.target.value)} style={{ padding: '12px', borderRadius: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Description (Optional)</label>
                <textarea placeholder="e.g. Main operations workspace for Latin America campaign runs..." className="glass-input" rows={3} value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} style={{ padding: '12px', borderRadius: '10px', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: BUSINESS PROFILE */}
          {currentStep === 5 && (
            <form onSubmit={handleBusinessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Step 5 of 9</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Business Profile</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
                  Set up the core brand identity for your first business inside the workspace.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <ImageIcon size={24} color="var(--color-text-muted)" />
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Upload</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px' }}>Business Name</label>
                  <input type="text" required placeholder="e.g. Acme Studio" className="glass-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ padding: '12px', borderRadius: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Brand Accent Color</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9', '#6366f1'].map(color => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: color,
                        cursor: 'pointer',
                        border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                        boxShadow: selectedColor === color ? `0 0 12px ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Headquarters / Address (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                  <input type="text" placeholder="123 Tech Avenue..." className="glass-input" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} style={{ padding: '12px 12px 12px 36px', borderRadius: '10px', width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: CHOOSE INDUSTRY */}
          {currentStep === 6 && (
            <form onSubmit={handleIndustrySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Step 6 of 9</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>Choose your Industry Template</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
                  This will pre-configure the Workspace OS with custom tool views and setup configurations suited for your industry.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxHeight: '320px', overflowY: 'auto', paddingRight: '8px' }}>
                {industries.map((ind) => {
                  const isSelected = selectedIndustry === ind.id;
                  return (
                    <div
                      key={ind.id}
                      onClick={() => setSelectedIndustry(ind.id)}
                      className="glass-card"
                      style={{
                        padding: '16px',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                        background: isSelected ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.01)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <strong style={{ fontSize: '14px', color: '#fff', display: 'block', marginBottom: '4px' }}>{ind.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4', display: 'block' }}>{ind.desc}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 7: CONNECT SOCIALS */}
          {currentStep === 7 && <SmartConnectionWizard />}

          {/* STEP 8: AI SCAN */}
          {currentStep === 8 && <AIBusinessAnalysis />}

          {/* STEP 9: WELCOME */}
          {currentStep === 9 && <WelcomeExperience />}

        </div>
      </div>
    </div>
  );
};
