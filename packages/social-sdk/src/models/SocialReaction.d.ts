export interface SocialReaction {
    readonly type: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';
    readonly count: number;
}
