import { SocialProfile } from './SocialProfile';
export interface SocialAccount {
    readonly providerId: string;
    readonly accountId: string;
    readonly name: string;
    readonly profile: SocialProfile;
    readonly status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}
