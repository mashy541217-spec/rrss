export interface PublishContentInput {
  readonly contentId: string;
  readonly title?: string;
  readonly body: string;
  readonly mediaUrls?: string[];
  readonly publishAt?: Date;
  readonly metadata?: Record<string, any>;
}

export interface PublishContentOutput {
  readonly success: boolean;
  readonly externalId?: string;
  readonly url?: string;
  readonly metadata?: Record<string, any>;
}
