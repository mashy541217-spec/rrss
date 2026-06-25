import { BrowserPage } from '@rrss-auto/browser-sdk';
import { CustomerSearchPage } from '../pom/CustomerSearchPage';
import { ReportViewerPage } from '../pom/ReportViewerPage';
import { DashboardPage } from '../pom/DashboardPage';

export class CustomerReportWorkflow {
  constructor(private readonly page: BrowserPage) {}

  public async execute(rut: string): Promise<{ pdfPath: string }> {
    // 1. Start from Dashboard
    const dashboard = new DashboardPage(this.page);
    await dashboard.navigateToCustomerSearch();

    // 2. Search Customer
    const searchPage = new CustomerSearchPage(this.page);
    await searchPage.waitForLoad();
    await searchPage.search(rut);
    await searchPage.openFirstResult();

    // 3. Generate Report
    const reportPage = new ReportViewerPage(this.page);
    await reportPage.waitForLoad();
    
    // In a real execution, we would tie this into BrowserContext.waitForEvent('download')
    await reportPage.generateAndDownloadPdf();

    return { pdfPath: '/tmp/dealernet-report-mock.pdf' };
  }
}
