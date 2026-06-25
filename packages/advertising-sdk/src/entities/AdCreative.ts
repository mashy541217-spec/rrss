export class AdCreative {
  id?: string;
  adGroupId!: string;
  name?: string;
  headlines: string[] = [];
  descriptions: string[] = [];
  imageUrls: string[] = [];
  videoUrls: string[] = [];
  landingPageUrl?: string;
  callToAction?: string;
  status: string = 'PENDING_REVIEW';
}
