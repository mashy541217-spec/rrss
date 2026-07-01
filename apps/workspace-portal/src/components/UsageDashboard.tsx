import React from 'react';
import { useSubscriptionStore, COMMERCIAL_PLANS } from '../store/useSubscriptionStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Server, Image as ImageIcon, MessageSquare, PieChart, Users, Layers, Zap, Clock, TrendingUp } from 'lucide-react';

export const UsageDashboard: React.FC = () => {
  const { currentPlanId, status, trialDaysRemaining } = useSubscriptionStore();
  const { 
    businesses, damAssets, socialAccounts, aiMessages, 
    automations, campaigns, reports
  } = useWorkspaceStore();

  const plan = COMMERCIAL_PLANS[currentPlanId];

  const renderProgressBar = (label: string, current: number, max: number, icon: React.ReactNode) => {
    const percentage = Math.min((current / max) * 100, 100);
    const isNearingLimit = percentage > 85;
    const isAtLimit = percentage >= 100;

    let barColor = 'var(--color-primary)';
    if (isAtLimit) barColor = 'var(--color-danger)';
    else if (isNearingLimit) barColor = 'var(--color-warning)';

    return (
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
            <div style={{ color: 'var(--color-text-muted)' }}>{icon}</div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{label}</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>
            {current} <span style={{ color: 'var(--color-text-muted)' }}>/ {max > 900000 ? 'Unlimited' : max}</span>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: barColor,
            borderRadius: '4px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
        
        {isAtLimit && (
          <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>Limit reached. Upgrade to increase capacity.</span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Usage & Billing</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Monitor your workspace resources and subscription limits.</p>
        </div>
      </div>

      {/* Plan Status Banner */}
      <div className="glass-panel" style={{ 
        padding: '32px', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>
            Current Plan
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{plan.name}</h3>
            {status === 'trialing' && (
              <span style={{ 
                background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '4px 10px', 
                borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' 
              }}>
                <Clock size={12} /> {trialDaysRemaining} Days Left
              </span>
            )}
          </div>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
            {plan.description}
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>
            ${plan.priceMonthly}<span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>/mo</span>
          </div>
        </div>
      </div>

      {/* Quota Grid */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--color-primary)" /> Resource Usage
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {renderProgressBar('Businesses', businesses.length, plan.quotas.maxBusinesses, <Layers size={16} />)}
          {renderProgressBar('Social Accounts', socialAccounts.length, plan.quotas.maxConnectedAccounts, <Users size={16} />)}
          {renderProgressBar('Media Assets', damAssets.length, plan.quotas.maxMediaAssets, <ImageIcon size={16} />)}
          {renderProgressBar('Monthly Campaigns', campaigns.length, plan.quotas.maxMonthlyPublications, <Zap size={16} />)}
          {renderProgressBar('Automations', automations.length, plan.quotas.maxAutomations, <Server size={16} />)}
          {renderProgressBar('AI Requests', aiMessages.length, plan.quotas.maxAiRequests, <MessageSquare size={16} />)}
          {renderProgressBar('Generated Reports', reports.length, plan.quotas.maxReports, <PieChart size={16} />)}
        </div>
      </div>

    </div>
  );
};
