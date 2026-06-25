export interface SocialProfile {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly bio?: string;
    readonly followersCount?: number;
    readonly isVerified?: boolean;
    readonly profilePictureUrl?: string;
}
