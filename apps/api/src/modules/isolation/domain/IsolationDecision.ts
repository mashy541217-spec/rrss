export enum WorkerDecision {
  REUSE_WORKER = 'REUSE_WORKER',
  CREATE_WORKER = 'CREATE_WORKER'
}

export enum VmDecision {
  REUSE_VM = 'REUSE_VM',
  CREATE_VM = 'CREATE_VM'
}

export enum BrowserProfileDecision {
  REUSE_BROWSER_PROFILE = 'REUSE_BROWSER_PROFILE',
  CREATE_BROWSER_PROFILE = 'CREATE_BROWSER_PROFILE'
}

export interface IsolationDecisionResult {
  workerAction: WorkerDecision;
  vmAction: VmDecision;
  browserProfileAction: BrowserProfileDecision;
  proxyAssigned: string;
  androidDeviceAction: 'REUSE_EMULATOR' | 'CREATE_EMULATOR' | 'NONE';
  desktopSessionAction: 'REUSE_SESSION' | 'CREATE_SESSION' | 'NONE';
  isolationScore: number;
  reason: string;
}

export class IsolationDecision {
  constructor(
    public readonly accountId: string,
    public readonly provider: string,
    public readonly workspaceId: string,
    public readonly result: IsolationDecisionResult,
    public readonly evaluatedAt: Date = new Date()
  ) {}
}
