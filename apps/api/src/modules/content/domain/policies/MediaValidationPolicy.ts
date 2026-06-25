import { Asset } from '../aggregate/Asset';
import { MediaCategory } from '../enums/MediaCategory';

export interface MediaConstraints {
  maxFileSizeBytes?: bigint;
  allowedCategories?: MediaCategory[];
  allowedMimeTypes?: string[];
}

export class MediaValidationPolicy {
  public validate(asset: Asset, constraints: MediaConstraints): { valid: boolean; reason?: string } {
    if (constraints.maxFileSizeBytes && asset.fileSize.bytes > constraints.maxFileSizeBytes) {
      return {
        valid: false,
        reason: `File size ${asset.fileSize.megabytes.toFixed(2)}MB exceeds maximum allowed`,
      };
    }
    if (constraints.allowedCategories && !constraints.allowedCategories.includes(asset.mediaType.value)) {
      return { valid: false, reason: `Media category ${asset.mediaType.value} is not allowed` };
    }
    if (constraints.allowedMimeTypes && !constraints.allowedMimeTypes.includes(asset.mimeType.value)) {
      return { valid: false, reason: `MIME type ${asset.mimeType.value} is not allowed` };
    }
    return { valid: true };
  }
}
