export interface BrowserActionOptions {
  timeoutMs?: number;
  force?: boolean;
  delayMs?: number; // Delay between keystrokes or mouse steps
  humanize?: boolean; // Overrides context stealth mode for a specific action
}
