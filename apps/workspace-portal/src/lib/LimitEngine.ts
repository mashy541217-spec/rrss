import { useSubscriptionStore, COMMERCIAL_PLANS } from '../store/useSubscriptionStore';
import type { PlanQuotas } from '../store/useSubscriptionStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const useLimitEngine = () => {
  const { currentPlanId, openUpgradeDialog } = useSubscriptionStore();
  const { businesses, socialAccounts, damAssets, campaigns, automations, aiMessages, reports } = useWorkspaceStore();

  const currentPlan = COMMERCIAL_PLANS[currentPlanId];

  const checkQuota = (quotaKey: keyof PlanQuotas, currentValue: number, actionName: string): boolean => {
    const limit = currentPlan.quotas[quotaKey];
    if (currentValue >= limit) {
      openUpgradeDialog(`You have reached the limit for ${actionName} on your current plan (${currentPlan.name}).`);
      return false;
    }
    return true;
  };

  return {
    canAddBusiness: () => checkQuota('maxBusinesses', businesses.length, 'Businesses'),
    canAddSocialAccount: () => checkQuota('maxConnectedAccounts', socialAccounts.length, 'Connected Social Accounts'),
    canUploadAsset: () => checkQuota('maxMediaAssets', damAssets.length, 'Media Assets'),
    canCreateCampaign: () => checkQuota('maxMonthlyPublications', campaigns.length, 'Campaigns / Publications'), // Simplified mapping
    canCreateAutomation: () => checkQuota('maxAutomations', automations.length, 'Automations'),
    canUseAi: () => checkQuota('maxAiRequests', aiMessages.length, 'AI Requests'),
    canGenerateReport: () => checkQuota('maxReports', reports.length, 'Generated Reports'),
    
    // Feature Checks
    hasFeature: (feature: keyof typeof currentPlan.features) => {
      return currentPlan.features[feature];
    }
  };
};
