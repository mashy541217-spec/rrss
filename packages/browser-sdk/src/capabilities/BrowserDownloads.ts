export interface BrowserDownload {
  /** Returns the suggested filename for this download */
  suggestedFilename(): string;

  /** Returns the URL from which the download was triggered */
  url(): string;

  /** Resolves when the download completes and returns an absolute file path or stream */
  path(): Promise<string | null>;

  /** Cancels a pending download */
  cancel(): Promise<void>;

  /** Fails if download failed */
  failure(): Promise<string | null>;
}
