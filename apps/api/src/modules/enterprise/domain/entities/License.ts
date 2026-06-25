export class License {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly licenseKey: string,
    public readonly type: 'ONLINE' | 'OFFLINE_AIRGAPPED',
    public readonly validUntil: Date,
    public readonly signature: string, // Cryptographic signature verifying limits
    public readonly limits: {
      maxWorkers: number;
      maxExecutions: number;
    },
    public isActive: boolean
  ) {}

  isValid(): boolean {
    return this.isActive && this.validUntil > new Date();
  }
}
