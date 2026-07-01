import React, { useState } from 'react';
import { Check, X, Shield, Sparkles } from 'lucide-react';
import { useSubscriptionStore, COMMERCIAL_PLANS } from '../store/useSubscriptionStore';
import type { PlanId } from '../store/useSubscriptionStore';

export const UpgradeCenter: React.FC = () => {
  const { currentPlanId, billingCycle } = useSubscriptionStore();
  const [localCycle, setLocalCycle] = useState<'monthly' | 'yearly'>(billingCycle);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  const plans = Object.values(COMMERCIAL_PLANS);

  const handleActionClick = (planId: PlanId) => {
    setSelectedPlan(planId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', padding: '6px 16px', borderRadius: '20px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '12px', marginBottom: '16px' }}>
          <Sparkles size={14} /> Upgrade Center
        </div>
        <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>Scale your Workspace to the next level</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: 1.6 }}>
          Choose a plan that fits your growth. No hidden fees. Enterprise-grade security out of the box.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', marginTop: '24px' }}>
          <button 
            onClick={() => setLocalCycle('monthly')}
            style={{ 
              background: localCycle === 'monthly' ? 'var(--color-primary)' : 'transparent',
              color: localCycle === 'monthly' ? '#fff' : 'var(--color-text-muted)',
              border: 'none', padding: '8px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
          <button 
            onClick={() => setLocalCycle('yearly')}
            style={{ 
              background: localCycle === 'yearly' ? 'var(--color-primary)' : 'transparent',
              color: localCycle === 'yearly' ? '#fff' : 'var(--color-text-muted)',
              border: 'none', padding: '8px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            Yearly <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const price = localCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          
          return (
            <div key={plan.id} className="glass-panel" style={{
              padding: '32px',
              borderRadius: '24px',
              border: isCurrent ? '2px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
              background: isCurrent ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(255,255,255,0.02) 100%)' : 'rgba(255, 255, 255, 0.02)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {isCurrent && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', letterSpacing: '1px' }}>
                  CURRENT PLAN
                </div>
              )}
              
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>{plan.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: '0 0 24px 0', minHeight: '40px' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800 }}>${price}</span>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>/{localCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Check size={16} color="var(--color-success)" />
                  <span style={{ color: 'var(--color-text)' }}>Up to <strong>{plan.quotas.maxBusinesses > 900000 ? 'Unlimited' : plan.quotas.maxBusinesses}</strong> Businesses</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Check size={16} color="var(--color-success)" />
                  <span style={{ color: 'var(--color-text)' }}><strong>{plan.quotas.maxStorageGB > 900000 ? 'Unlimited' : plan.quotas.maxStorageGB}GB</strong> Storage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  {plan.features.aiCopilot ? <Check size={16} color="var(--color-success)" /> : <X size={16} color="var(--color-text-muted)" />}
                  <span style={{ color: plan.features.aiCopilot ? 'var(--color-text)' : 'var(--color-text-muted)' }}>AI Copilot</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  {plan.features.whiteLabel ? <Check size={16} color="var(--color-success)" /> : <X size={16} color="var(--color-text-muted)" />}
                  <span style={{ color: plan.features.whiteLabel ? 'var(--color-text)' : 'var(--color-text-muted)' }}>White Label Customization</span>
                </div>
              </div>

              <button 
                onClick={() => handleActionClick(plan.id)}
                disabled={isCurrent}
                className={isCurrent ? "btn-secondary" : "btn-primary"}
                style={{ width: '100%', padding: '12px', fontWeight: 600, opacity: isCurrent ? 0.5 : 1, cursor: isCurrent ? 'default' : 'pointer' }}
              >
                {isCurrent ? 'Active Plan' : (plan.priceMonthly > COMMERCIAL_PLANS[currentPlanId].priceMonthly ? 'Upgrade' : 'Downgrade')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Simulated Checkout Overlay */}
      {selectedPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '400px', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', margin: '0 auto 24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Shield size={32} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Secure Checkout</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              You are about to switch to the <strong>{COMMERCIAL_PLANS[selectedPlan].name}</strong> plan. Real payment providers (Stripe, PayPal) will be activated in the next release.
            </p>
            <button className="btn-primary" onClick={() => setSelectedPlan(null)} style={{ width: '100%', padding: '12px', fontWeight: 600 }}>
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
