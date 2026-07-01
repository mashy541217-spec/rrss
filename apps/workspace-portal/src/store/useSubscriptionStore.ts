import { create } from 'zustand';

export type PlanId = 'free' | 'starter' | 'professional' | 'business' | 'enterprise' | 'unlimited';
export type LicenseType = 'trial' | 'commercial' | 'lifetime' | 'enterprise' | 'offline' | 'educational' | 'partner' | 'internal' | 'developer';

export interface PlanFeatures {
  aiCopilot: boolean;
  automationStudio: boolean;
  reports: boolean;
  analytics: boolean;
  marketplace: boolean;
  whiteLabel: boolean;
  cloudWorkers: boolean;
  advancedAi: boolean;
  advancedReports: boolean;
  enterpriseApi: boolean;
  sap: boolean;
  salesforce: boolean;
  shopify: boolean;
  wooCommerce: boolean;
  googleAds: boolean;
  metaAds: boolean;
  customPlugins: boolean;
  desktopAutomation: boolean;
  mobileAutomation: boolean;
}

export interface PlanQuotas {
  maxOrganizations: number;
  maxWorkspaces: number;
  maxBusinesses: number;
  maxTeamMembers: number;
  maxStorageGB: number;
  maxMonthlyPublications: number;
  maxScheduledPosts: number;
  maxAutomations: number;
  maxAiRequests: number;
  maxConnectedAccounts: number;
  maxReports: number;
  maxMediaAssets: number;
  maxApiRequests: number;
  maxConcurrentExecutions: number;
  maxWorkers: number;
  maxCloudResources: number;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  quotas: PlanQuotas;
  features: PlanFeatures;
  whiteLabelTiers: {
    customLogo: boolean;
    customDomain: boolean;
    customSmtp: boolean;
    customColors: boolean;
    customBranding: boolean;
    marketplacePublishing: boolean;
    enterpriseSupport: boolean;
    dedicatedInfrastructure: boolean;
  };
}

export const COMMERCIAL_PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for exploring the Workspace OS.',
    quotas: {
      maxOrganizations: 1, maxWorkspaces: 1, maxBusinesses: 1, maxTeamMembers: 1,
      maxStorageGB: 1, maxMonthlyPublications: 30, maxScheduledPosts: 5,
      maxAutomations: 1, maxAiRequests: 50, maxConnectedAccounts: 3,
      maxReports: 1, maxMediaAssets: 50, maxApiRequests: 1000,
      maxConcurrentExecutions: 1, maxWorkers: 0, maxCloudResources: 0
    },
    features: {
      aiCopilot: false, automationStudio: false, reports: false, analytics: true,
      marketplace: false, whiteLabel: false, cloudWorkers: false, advancedAi: false,
      advancedReports: false, enterpriseApi: false, sap: false, salesforce: false,
      shopify: false, wooCommerce: false, googleAds: false, metaAds: false,
      customPlugins: false, desktopAutomation: false, mobileAutomation: false
    },
    whiteLabelTiers: {
      customLogo: false, customDomain: false, customSmtp: false, customColors: false,
      customBranding: false, marketplacePublishing: false, enterpriseSupport: false, dedicatedInfrastructure: false
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    priceYearly: 290,
    description: 'Great for solo entrepreneurs and small teams.',
    quotas: {
      maxOrganizations: 1, maxWorkspaces: 2, maxBusinesses: 3, maxTeamMembers: 3,
      maxStorageGB: 10, maxMonthlyPublications: 150, maxScheduledPosts: 30,
      maxAutomations: 5, maxAiRequests: 500, maxConnectedAccounts: 10,
      maxReports: 5, maxMediaAssets: 500, maxApiRequests: 10000,
      maxConcurrentExecutions: 2, maxWorkers: 1, maxCloudResources: 1
    },
    features: {
      aiCopilot: true, automationStudio: true, reports: true, analytics: true,
      marketplace: false, whiteLabel: false, cloudWorkers: false, advancedAi: false,
      advancedReports: false, enterpriseApi: false, sap: false, salesforce: false,
      shopify: false, wooCommerce: false, googleAds: false, metaAds: false,
      customPlugins: false, desktopAutomation: false, mobileAutomation: false
    },
    whiteLabelTiers: {
      customLogo: true, customDomain: false, customSmtp: false, customColors: true,
      customBranding: false, marketplacePublishing: false, enterpriseSupport: false, dedicatedInfrastructure: false
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    priceMonthly: 79,
    priceYearly: 790,
    description: 'The standard for growing agencies.',
    quotas: {
      maxOrganizations: 1, maxWorkspaces: 5, maxBusinesses: 15, maxTeamMembers: 10,
      maxStorageGB: 50, maxMonthlyPublications: 1000, maxScheduledPosts: 300,
      maxAutomations: 20, maxAiRequests: 2000, maxConnectedAccounts: 50,
      maxReports: 30, maxMediaAssets: 5000, maxApiRequests: 50000,
      maxConcurrentExecutions: 5, maxWorkers: 5, maxCloudResources: 3
    },
    features: {
      aiCopilot: true, automationStudio: true, reports: true, analytics: true,
      marketplace: true, whiteLabel: true, cloudWorkers: true, advancedAi: true,
      advancedReports: true, enterpriseApi: true, sap: false, salesforce: false,
      shopify: true, wooCommerce: true, googleAds: true, metaAds: true,
      customPlugins: false, desktopAutomation: false, mobileAutomation: false
    },
    whiteLabelTiers: {
      customLogo: true, customDomain: true, customSmtp: true, customColors: true,
      customBranding: true, marketplacePublishing: false, enterpriseSupport: false, dedicatedInfrastructure: false
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    priceMonthly: 199,
    priceYearly: 1990,
    description: 'Advanced features for scaling businesses.',
    quotas: {
      maxOrganizations: 3, maxWorkspaces: 15, maxBusinesses: 50, maxTeamMembers: 30,
      maxStorageGB: 200, maxMonthlyPublications: 5000, maxScheduledPosts: 1500,
      maxAutomations: 100, maxAiRequests: 10000, maxConnectedAccounts: 150,
      maxReports: 100, maxMediaAssets: 20000, maxApiRequests: 200000,
      maxConcurrentExecutions: 15, maxWorkers: 15, maxCloudResources: 10
    },
    features: {
      aiCopilot: true, automationStudio: true, reports: true, analytics: true,
      marketplace: true, whiteLabel: true, cloudWorkers: true, advancedAi: true,
      advancedReports: true, enterpriseApi: true, sap: true, salesforce: true,
      shopify: true, wooCommerce: true, googleAds: true, metaAds: true,
      customPlugins: true, desktopAutomation: true, mobileAutomation: true
    },
    whiteLabelTiers: {
      customLogo: true, customDomain: true, customSmtp: true, customColors: true,
      customBranding: true, marketplacePublishing: true, enterpriseSupport: true, dedicatedInfrastructure: false
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 499,
    priceYearly: 4990,
    description: 'Maximum power and dedicated infrastructure.',
    quotas: {
      maxOrganizations: 10, maxWorkspaces: 50, maxBusinesses: 200, maxTeamMembers: 100,
      maxStorageGB: 1000, maxMonthlyPublications: 25000, maxScheduledPosts: 5000,
      maxAutomations: 500, maxAiRequests: 50000, maxConnectedAccounts: 500,
      maxReports: 500, maxMediaAssets: 100000, maxApiRequests: 1000000,
      maxConcurrentExecutions: 50, maxWorkers: 50, maxCloudResources: 30
    },
    features: {
      aiCopilot: true, automationStudio: true, reports: true, analytics: true,
      marketplace: true, whiteLabel: true, cloudWorkers: true, advancedAi: true,
      advancedReports: true, enterpriseApi: true, sap: true, salesforce: true,
      shopify: true, wooCommerce: true, googleAds: true, metaAds: true,
      customPlugins: true, desktopAutomation: true, mobileAutomation: true
    },
    whiteLabelTiers: {
      customLogo: true, customDomain: true, customSmtp: true, customColors: true,
      customBranding: true, marketplacePublishing: true, enterpriseSupport: true, dedicatedInfrastructure: true
    }
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    priceMonthly: 999,
    priceYearly: 9990,
    description: 'No limits. Build your empire.',
    quotas: {
      maxOrganizations: 999999, maxWorkspaces: 999999, maxBusinesses: 999999, maxTeamMembers: 999999,
      maxStorageGB: 999999, maxMonthlyPublications: 999999, maxScheduledPosts: 999999,
      maxAutomations: 999999, maxAiRequests: 999999, maxConnectedAccounts: 999999,
      maxReports: 999999, maxMediaAssets: 999999, maxApiRequests: 999999,
      maxConcurrentExecutions: 999999, maxWorkers: 999999, maxCloudResources: 999999
    },
    features: {
      aiCopilot: true, automationStudio: true, reports: true, analytics: true,
      marketplace: true, whiteLabel: true, cloudWorkers: true, advancedAi: true,
      advancedReports: true, enterpriseApi: true, sap: true, salesforce: true,
      shopify: true, wooCommerce: true, googleAds: true, metaAds: true,
      customPlugins: true, desktopAutomation: true, mobileAutomation: true
    },
    whiteLabelTiers: {
      customLogo: true, customDomain: true, customSmtp: true, customColors: true,
      customBranding: true, marketplacePublishing: true, enterpriseSupport: true, dedicatedInfrastructure: true
    }
  }
};

export interface SubscriptionState {
  currentPlanId: PlanId;
  licenseType: LicenseType;
  trialDaysRemaining: number | null;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  
  // Coupon & Promo state (Architecture only)
  activeCouponCode: string | null;
  activePartnerCode: string | null;

  // Dialog State
  upgradeDialogOpen: boolean;
  upgradeDialogReason: string;

  // Actions
  setPlan: (plan: PlanId) => void;
  openUpgradeDialog: (reason: string) => void;
  closeUpgradeDialog: () => void;
  setTrialDays: (days: number | null) => void;
  applyCoupon: (code: string) => void;
  applyPartnerCode: (code: string) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentPlanId: 'free',
  licenseType: 'trial',
  trialDaysRemaining: 14,
  status: 'trialing',
  billingCycle: 'monthly',
  
  activeCouponCode: null,
  activePartnerCode: null,

  upgradeDialogOpen: false,
  upgradeDialogReason: '',

  setPlan: (plan) => set({ currentPlanId: plan, status: 'active', licenseType: 'commercial', trialDaysRemaining: null }),
  openUpgradeDialog: (reason) => set({ upgradeDialogOpen: true, upgradeDialogReason: reason }),
  closeUpgradeDialog: () => set({ upgradeDialogOpen: false, upgradeDialogReason: '' }),
  setTrialDays: (days) => set({ trialDaysRemaining: days, status: days && days > 0 ? 'trialing' : 'expired' }),
  applyCoupon: (code) => set({ activeCouponCode: code }),
  applyPartnerCode: (code) => set({ activePartnerCode: code })
}));
