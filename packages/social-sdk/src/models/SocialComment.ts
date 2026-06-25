export interface SocialComment {
  readonly id: string;
  readonly publicationId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly text: string;
  readonly createdAt: Date;
}
