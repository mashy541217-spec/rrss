export interface SapEnvironmentProfile {
  hostname: string;
  version: 'ECC' | 'S4HANA';
  availableApis: {
    odata: boolean;
    rfc: boolean;
    bapi: boolean;
  };
  availableGuis: {
    fiori: boolean;
    webGui: boolean;
    desktopGui: boolean;
  };
  installedModules: string[];
}
