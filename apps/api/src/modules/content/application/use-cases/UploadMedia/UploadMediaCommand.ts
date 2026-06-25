import { ICommand } from '@rrss-auto/application';
import { MediaCategory } from '../../../domain/enums/MediaCategory';
import { AssetVisibility } from '../../../domain/enums/AssetVisibility';

export class UploadMediaCommand implements ICommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly uploadedBy: string,
    public readonly mediaCategory: MediaCategory,
    public readonly mimeType: string,
    public readonly fileSizeBytes: number,
    public readonly url: string,
    public readonly bucket?: string,
    public readonly storageKey?: string,
    public readonly checksum?: string,
    public readonly visibility?: AssetVisibility,
    public readonly tags?: string[],
  ) {}
}
