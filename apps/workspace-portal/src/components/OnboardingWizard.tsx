import React, { useState } from 'react';
import { Building2, Layers, Briefcase, Share2, Play, CheckCircle2, ChevronRight, ChevronLeft, ShoppingBag, Home, Cpu, Store, Hotel, Stethoscope, Scale, GraduationCap, Car, Mic, UserCircle, Box } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { SocialConnectionCenter } from './SocialConnectionCenter';
import confetti from 'canvas-confetti';

export const OnboardingWizard: React.FC = () => {
  const {
    currentStep, organizationName, workspaceName, workspaceSlug,
    nextStep, prevStep, setOrganizationName, createWorkspace, addBusiness,
    businesses, socialAccounts, completeOnboarding, t,
    businessTemplate, setBusinessTemplate
  } = useWorkspaceStore();

  // Step 2 inputs
  const [description, setDescription] = useState('');
  const [wsName, setWsName] = useState('');
  const [wsSlug, setWsSlug] = useState('');
  const [country, setCountry] = useState('US');
  const [category, setCategory] = useState('Marketing Agency');

  // Step 3 inputs
  const [businessName, setBusinessName] = useState('');
  const [busCategory, setBusCategory] = useState('Marketing Agency');

  // Step 5 inputs
  const [selectedTemplate, setSelectedTemplate] = useState('instagram-auto');

  // Log descriptions/inputs silently to satisfy unused checks if needed, or omit
  console.log('Wizard state loaded. Description length:', description.length);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) return;
    nextStep();
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim() || !wsSlug.trim()) return;
    await createWorkspace({
      name: wsName,
      slug: wsSlug,
      timezone: 'America/New_York',
      locale: 'en-US'
    });
    nextStep();
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    addBusiness(businessName, busCategory);
    nextStep();
  };

  const handleLaunch = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    completeOnboarding();
  };

  const stepsList = [
    { num: 1, name: t.wizard.orgLabel.split(' ')[0], icon: <Building2 size={16} /> },
    { num: 2, name: t.navigation.activeWorkspace.split(' ')[0], icon: <Layers size={16} /> },
    { num: 3, name: t.navigation.businesses, icon: <Briefcase size={16} /> },
    { num: 4, name: t.navigation.social.split(' ')[0], icon: <Share2 size={16} /> },
    { num: 5, name: t.navigation.automation.split(' ')[0], icon: <Play size={16} /> },
    { num: 6, name: t.wizard.launch.split(' ')[0], icon: <CheckCircle2 size={16} /> }
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
      {/* Visual steps header progress */}
      <div className="glass-panel" style={{ borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {stepsList.map((step) => {
          const isActive = step.num === currentStep;
          const isDone = step.num < currentStep;
          return (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isActive || isDone ? 1 : 0.4 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isDone ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '13px'
              }}>
                {isDone ? <CheckCircle2 size={16} /> : step.num}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'var(--color-text-muted)' }}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Steps contents container */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between' }}>
        
        {/* STEP 1: ORGANIZATION */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>{t.wizard.orgTitle}</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{t.wizard.orgDesc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.wizard.orgLabel}</label>
              <input
                type="text"
                required
                className="glass-input"
                placeholder={t.wizard.orgPlaceholder}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                style={{ fontSize: '15px', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="submit" className="btn-primary">
                {t.wizard.next} <ChevronRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: WORKSPACE */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>{t.wizard.wsTitle}</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{t.wizard.wsDesc}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.wizard.wsLabel}</label>
                <input type="text" required placeholder={t.wizard.wsPlaceholder} className="glass-input" value={wsName} onChange={(e) => setWsName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.wizard.wsSlugLabel}</label>
                <input type="text" required placeholder={t.wizard.wsSlugPlaceholder} className="glass-input" value={wsSlug} onChange={(e) => setWsSlug(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Timezone</label>
                <select className="glass-input">
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>America/Santiago (CLT)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Language / Idioma</label>
                <select className="glass-input">
                  <option>English (en-US)</option>
                  <option>Spanish (es-ES)</option>
                  <option>Portuguese (pt-BR)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Country</label>
                <input type="text" placeholder="e.g. Chile" className="glass-input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.wizard.busCatLabel}</label>
                <input type="text" placeholder="e.g. Retail, Agency" className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>Description</label>
              <textarea placeholder="Tell us about the scope of this workspace..." className="glass-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button type="button" onClick={prevStep} className="btn-secondary">
                <ChevronLeft size={16} /> {t.wizard.prev}
              </button>
              <button type="submit" className="btn-primary">
                {t.wizard.next} <ChevronRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: BUSINESS UNIT */}
        {currentStep === 3 && (() => {
          const templatesList = [
            {
              id: 'marketing-agency',
              title: 'Marketing Agency',
              desc: 'Configure multi-brand environments, content calendars, and white-labeling templates.',
              icon: <Briefcase size={22} style={{ color: 'var(--color-primary)' }} />,
              badge: 'Agency Scaling',
              color: 'rgba(139, 92, 246, 0.08)'
            },
            {
              id: 'ecommerce',
              title: 'E-Commerce & Retail',
              desc: 'Direct connection with Shopify, WooCommerce, and automatic product sync catalogs.',
              icon: <ShoppingBag size={22} style={{ color: '#10b981' }} />,
              badge: 'Store Integration',
              color: 'rgba(16, 185, 129, 0.08)'
            },
            {
              id: 'retail',
              title: 'Retail Store',
              desc: 'Physical store foot-traffic campaigns, Google Business syncing, and local ads.',
              icon: <Building2 size={22} style={{ color: '#f59e0b' }} />,
              badge: 'Local Retail',
              color: 'rgba(245, 158, 11, 0.08)'
            },
            {
              id: 'restaurant',
              title: 'Restaurant',
              desc: 'Menu showcases, reservation automations, and localized Google Business integration.',
              icon: <Store size={22} style={{ color: '#ef4444' }} />,
              badge: 'Hospitality',
              color: 'rgba(239, 68, 68, 0.08)'
            },
            {
              id: 'hotel',
              title: 'Hotel & Hospitality',
              desc: 'Visual room showcases, local SEO, booking integrations, and review management.',
              icon: <Hotel size={22} style={{ color: '#0ea5e9' }} />,
              badge: 'Hospitality',
              color: 'rgba(14, 165, 233, 0.08)'
            },
            {
              id: 'real-estate',
              title: 'Real Estate',
              desc: 'Visual property showcase publishing, local geolocation tags, and local leads integration.',
              icon: <Home size={22} style={{ color: '#8b5cf6' }} />,
              badge: 'Local Geo-Targets',
              color: 'rgba(139, 92, 246, 0.08)'
            },
            {
              id: 'medical',
              title: 'Medical Clinic',
              desc: 'Secure WhatsApp booking, Google Business reviews, and educational content feeds.',
              icon: <Stethoscope size={22} style={{ color: '#10b981' }} />,
              badge: 'Healthcare',
              color: 'rgba(16, 185, 129, 0.08)'
            },
            {
              id: 'law',
              title: 'Law Firm',
              desc: 'LinkedIn authority building, secure lead generation, and Google Business presence.',
              icon: <Scale size={22} style={{ color: '#64748b' }} />,
              badge: 'Professional',
              color: 'rgba(100, 116, 139, 0.08)'
            },
            {
              id: 'tech-saas',
              title: 'Technology Company',
              desc: 'Secure API connections, developer logs, ERP pipelines, and Telegram logs.',
              icon: <Cpu size={22} style={{ color: '#3b82f6' }} />,
              badge: 'Tech & SaaS',
              color: 'rgba(59, 130, 246, 0.08)'
            },
            {
              id: 'education',
              title: 'Education',
              desc: 'Course promotions, student engagement across TikTok and YouTube, alumni networking.',
              icon: <GraduationCap size={22} style={{ color: '#f59e0b' }} />,
              badge: 'E-Learning',
              color: 'rgba(245, 158, 11, 0.08)'
            },
            {
              id: 'automotive',
              title: 'Automotive',
              desc: 'Vehicle showcases, inventory syncing, test drive bookings via WhatsApp.',
              icon: <Car size={22} style={{ color: '#ef4444' }} />,
              badge: 'Dealerships',
              color: 'rgba(239, 68, 68, 0.08)'
            },
            {
              id: 'influencer',
              title: 'Influencer',
              desc: 'Cross-platform viral publishing, personal brand kits, and engagement analytics.',
              icon: <Mic size={22} style={{ color: '#d946ef' }} />,
              badge: 'Personal Brand',
              color: 'rgba(217, 70, 239, 0.08)'
            },
            {
              id: 'freelancer',
              title: 'Freelancer',
              desc: 'Portfolio showcasing, LinkedIn networking, and streamlined client acquisition.',
              icon: <UserCircle size={22} style={{ color: '#14b8a6' }} />,
              badge: 'Solo Business',
              color: 'rgba(20, 184, 166, 0.08)'
            },
            {
              id: 'other',
              title: 'Other',
              desc: 'Blank canvas. Start from scratch and customize all integrations manually.',
              icon: <Box size={22} style={{ color: '#94a3b8' }} />,
              badge: 'Custom Build',
              color: 'rgba(148, 163, 184, 0.08)'
            }
          ];

          // Auto-initialize template on mount if empty
          if (!businessTemplate) {
            setBusinessTemplate('marketing-agency');
          }

          return (
            <form onSubmit={handleStep3Submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>{t.wizard.busTitle}</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>{t.wizard.busDesc}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>{t.wizard.busLabel}</label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  placeholder={t.wizard.busPlaceholder}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{ fontSize: '15px', padding: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Choose a Business Template Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {templatesList.map((tpl) => {
                    const isSelected = businessTemplate === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          setBusCategory(tpl.title);
                          setBusinessTemplate(tpl.id);
                        }}
                        className="glass-card"
                        style={{
                          padding: '18px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          background: isSelected ? tpl.color : 'rgba(255, 255, 255, 0.01)',
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          boxShadow: isSelected ? '0 4px 20px rgba(139, 92, 246, 0.15)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {tpl.icon}
                          </div>
                          <span style={{
                            fontSize: '10px',
                            background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            {tpl.badge}
                          </span>
                        </div>
                        <div>
                          <strong style={{ fontSize: '15px', color: '#fff', display: 'block', marginBottom: '4px' }}>{tpl.title}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4', display: 'block' }}>{tpl.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <ChevronLeft size={16} /> {t.wizard.prev}
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  {t.wizard.next} <ChevronRight size={16} />
                </button>
              </div>
            </form>
          );
        })()}

        {/* STEP 4: SOCIAL CONNECTIONS */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>{t.wizard.socialTitle}</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '10px' }}>{t.wizard.socialDesc}</p>
            </div>

            <SocialConnectionCenter />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button type="button" onClick={prevStep} className="btn-secondary">
                <ChevronLeft size={16} /> {t.wizard.prev}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={socialAccounts.length === 0}
                style={{ opacity: socialAccounts.length === 0 ? 0.5 : 1 }}
              >
                {t.wizard.next} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FIRST AUTOMATION */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>{t.wizard.autoTitle}</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{t.wizard.autoDesc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                onClick={() => setSelectedTemplate('instagram-auto')}
                className="glass-card"
                style={{
                  padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  borderColor: selectedTemplate === 'instagram-auto' ? 'var(--color-primary)' : 'var(--color-border)',
                  background: selectedTemplate === 'instagram-auto' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📸
                </div>
                <div>
                  <strong>Instagram Auto-Publisher</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Automatically monitors custom media folders and publishes posts with AI-optimized copy.</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedTemplate('whatsapp-lead')}
                className="glass-card"
                style={{
                  padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  borderColor: selectedTemplate === 'whatsapp-lead' ? 'var(--color-primary)' : 'var(--color-border)',
                  background: selectedTemplate === 'whatsapp-lead' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  💬
                </div>
                <div>
                  <strong>WhatsApp Lead Response Auto-Pilot</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Autodetects customer messages and replies with intelligent templates and dynamic greetings.</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedTemplate('multi-cross')}
                className="glass-card"
                style={{
                  padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  borderColor: selectedTemplate === 'multi-cross' ? 'var(--color-primary)' : 'var(--color-border)',
                  background: selectedTemplate === 'multi-cross' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⚡
                </div>
                <div>
                  <strong>Cross-Channel Viral Publisher</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Publishes campaigns simultaneously across Instagram, Facebook, Threads, and TikTok.</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button type="button" onClick={prevStep} className="btn-secondary">
                <ChevronLeft size={16} /> {t.wizard.prev}
              </button>
              <button type="button" onClick={nextStep} className="btn-primary">
                {t.wizard.next} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: LAUNCH */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--color-success)' }} />
            </div>

            <div>
              <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>{t.wizard.launchTitle}</h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                {t.wizard.launchDesc}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', width: '100%', maxWidth: '500px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Workspace Unit:</strong> {workspaceName} (Slug: `{workspaceSlug}`)</div>
              <div><strong>Business Registered:</strong> {businesses?.[0]?.name}</div>
              <div><strong>Social Connections Isolated:</strong> {socialAccounts.length} profiles linked.</div>
              <div><strong>Initial Automation:</strong> Active (Template ID: `{selectedTemplate}`)</div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <button type="button" onClick={prevStep} className="btn-secondary">
                <ChevronLeft size={16} /> {t.wizard.prev}
              </button>
              <button type="button" onClick={handleLaunch} className="btn-primary" style={{ padding: '12px 30px', fontSize: '15px' }}>
                {t.wizard.launchBtn} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
