import { ICommand } from '@rrss-auto/application';

export class UpdateMetadataCommand implements ICommand {
  constructor(
    public readonly contentId: string,
    public readonly updatedBy: string,
    public readonly caption?: string,
    public readonly hashtags?: string[],
    public readonly seoTitle?: string,
    public readonly seoDescription?: string,
    public readonly tags?: string[],
    public readonly thumbnailAssetId?: string,
    public readonly customFields?: Record<string, unknown>,
  ) {}
}
