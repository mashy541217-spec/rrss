export interface BrowserDialog {
  /** Dialog type: alert, confirm, prompt, or beforeunload */
  type(): string;

  /** The message displayed in the dialog */
  message(): string;

  /** The default prompt value if any */
  defaultValue(): string;

  /** Accepts the dialog, optionally passing prompt text */
  accept(promptText?: string): Promise<void>;

  /** Dismisses the dialog */
  dismiss(): Promise<void>;
}
