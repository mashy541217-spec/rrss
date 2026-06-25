import { BasePage } from '@rrss-auto/enterprise-web-toolkit';
import { BrowserPage } from '@rrss-auto/browser-sdk';

export class ReportViewerPage extends BasePage {
  constructor(page: BrowserPage) {
    super(page);
  }

  private readonly selectors = {
    generatePdfButton: '#btn-generate-pdf',
    downloadPdfButton: '#btn-download-pdf',
    loadingSpinner: '.report-loading-spinner'
  };

  async waitForLoad(): Promise<void> {
    const isVisible = await this.getLocator(this.selectors.generatePdfButton).isVisible({ timeoutMs: 5000 }).catch(() => false);
    if (!isVisible) throw new Error('ReportViewerPage failed to load');
  }

  async generateAndDownloadPdf(): Promise<void> {
    await this.getLocator(this.selectors.generatePdfButton).click();
    
    // Wait for generation to finish (spinner disappears)
    // Normally we'd use a WaitingEngine, but for now we'll just wait for the download button to be enabled
    
    // Trigger download (In a real scenario, this click triggers the download pipeline)
    await this.getLocator(this.selectors.downloadPdfButton).click();
  }
}
