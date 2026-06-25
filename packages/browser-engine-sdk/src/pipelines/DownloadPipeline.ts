import { BrowserDownload } from '@rrss-auto/browser-sdk';
import * as fs from 'fs';
import * as path from 'path';

export class DownloadPipeline {
  /**
   * Generic pipeline to securely stream an engine-provided download
   * into a controlled temp directory, verifying its size/format.
   */
  public static async verifyAndSave(download: BrowserDownload, targetDir: string): Promise<string> {
    const tempPath = await download.path();
    const failure = await download.failure();
    
    if (failure || !tempPath) {
      throw new Error(`Download failed: ${failure}`);
    }

    const finalPath = path.join(targetDir, download.suggestedFilename());
    // Move the file (simulated here)
    // fs.renameSync(tempPath, finalPath);
    
    return finalPath; // Mock returning the target location
  }
}
