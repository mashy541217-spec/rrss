import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { IsolationDecision, WorkerDecision, VmDecision, BrowserProfileDecision, IsolationDecisionResult } from '../domain/IsolationDecision';

export class EvaluateIsolationCommand {
  constructor(
    public readonly workspaceId: string,
    public readonly provider: string,
    public readonly accountId: string,
    public readonly riskLevel?: 'high' | 'medium' | 'low'
  ) {}
}

@CommandHandler(EvaluateIsolationCommand)
export class EvaluateIsolationUseCase implements ICommandHandler<EvaluateIsolationCommand, IsolationDecision> {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(command: EvaluateIsolationCommand): Promise<IsolationDecision> {
    const { workspaceId, provider, accountId } = command;
    const lowerProvider = provider.toLowerCase();

    // 1. Fetch existing accounts of the same provider in this workspace to enforce Anti-Detection Isolation
    const existingAccounts = await this.prisma.credential.findMany({
      where: {
        ownerId: workspaceId, // ownerId maps to the workspace or owner depending on context, or use metadata
        isDeleted: false,
      }
    });

    const matches = existingAccounts.filter((acc) => {
      const meta = acc.metadata as any;
      return meta && meta.platform === lowerProvider;
    });

    let isolationScore = 20; // default base risk
    let reason = 'Standard low-risk provider shared footprint policy applied.';
    
    let workerAction = WorkerDecision.REUSE_WORKER;
    let vmAction = VmDecision.REUSE_VM;
    let browserProfileAction = BrowserProfileDecision.REUSE_BROWSER_PROFILE;
    let androidDeviceAction: 'REUSE_EMULATOR' | 'CREATE_EMULATOR' | 'NONE' = 'NONE';
    let desktopSessionAction: 'REUSE_SESSION' | 'CREATE_SESSION' | 'NONE' = 'NONE';
    let proxyAssigned = 'DIRECT_CONNECTION';

    // 2. High sensitivity anti-detection assessment
    const isSensitive = ['facebook', 'instagram', 'threads', 'google_ads', 'whatsapp'].includes(lowerProvider);

    if (isSensitive) {
      isolationScore = 60;
      browserProfileAction = BrowserProfileDecision.CREATE_BROWSER_PROFILE;
      proxyAssigned = `192.168.10.${Math.floor(Math.random() * 250) + 2}:3128 (Dedicated SOCKS5)`;
      reason = 'High-sensitivity channel requires dedicated isolated browser cookies, cache, and canvas signatures.';

      if (matches.length > 0 || command.riskLevel === 'high') {
        isolationScore = 95;
        workerAction = WorkerDecision.CREATE_WORKER;
        vmAction = VmDecision.CREATE_VM;
        reason = `Anti-Detection Policy active: Workspace contains ${matches.length} other ${provider} account(s). Isolation Engine provisioning dedicated Worker node and Virtual Machine to prevent fingerprint sharing.`;
      }
      
      if (lowerProvider === 'whatsapp') {
        androidDeviceAction = 'CREATE_EMULATOR';
      }
    } else if (lowerProvider === 'dealernet' || lowerProvider === 'sap' || lowerProvider === 'salesforce') {
      // Legacy ERPs requiring custom desktop execution profiles
      isolationScore = 50;
      desktopSessionAction = 'CREATE_SESSION';
      reason = 'Enterprise ERP/CRM connector requires dedicated desktop session runtime isolation.';
    }

    const result: IsolationDecisionResult = {
      workerAction,
      vmAction,
      browserProfileAction,
      proxyAssigned,
      androidDeviceAction,
      desktopSessionAction,
      isolationScore,
      reason
    };

    return new IsolationDecision(
      accountId,
      provider,
      workspaceId,
      result
    );
  }
}
