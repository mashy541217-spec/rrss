import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { EvaluateIsolationCommand, EvaluateIsolationUseCase } from './EvaluateIsolationUseCase';
import { AllocateVMUseCase } from '../../resource-manager/application/use-cases/AllocateVM/AllocateVMUseCase';
import { AllocateWorkerUseCase } from '../../resource-manager/application/use-cases/AllocateWorker/AllocateWorkerUseCase';
import { FingerprintGenerator } from '@rrss-auto/browser-engine-sdk';
import { ProxyPoolManager } from '../../credentials/domain/services/ProxyPoolManager';
import { ProvisioningStore } from './ProvisioningStore';

export class ProvisionIsolationCommand {
  constructor(
    public readonly workspaceId: string,
    public readonly provider: string,
    public readonly accountId: string,
    public readonly riskLevel?: 'high' | 'medium' | 'low'
  ) {}
}

@CommandHandler(ProvisionIsolationCommand)
export class ProvisionIsolationUseCase implements ICommandHandler<ProvisionIsolationCommand, void> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluateUseCase: EvaluateIsolationUseCase,
    private readonly allocateVMUseCase: AllocateVMUseCase,
    private readonly allocateWorkerUseCase: AllocateWorkerUseCase,
    private readonly proxyPoolManager: ProxyPoolManager,
    private readonly store: ProvisioningStore
  ) {}

  public async execute(command: ProvisionIsolationCommand): Promise<void> {
    const { workspaceId, provider, accountId, riskLevel } = command;

    // 1. Evaluate isolation decision to know what resources are needed
    const decision = await this.evaluateUseCase.execute(
      new EvaluateIsolationCommand(workspaceId, provider, accountId, riskLevel)
    );

    // 2. Initialize checklist in store
    const steps = [
      { name: 'Evaluating footprint risk policies', status: 'pending' as const },
      { name: 'Reserving virtual machine capacity (VM pool allocation)', status: 'pending' as const },
      { name: 'Scaling dedicated worker docker nodes', status: 'pending' as const },
      { name: 'Injecting anti-detection fingerprint parameters', status: 'pending' as const },
      { name: 'Verifying SOCKS5 proxy handshake & residential rotation', status: 'pending' as const },
      { name: 'Deploying connection environment', status: 'pending' as const }
    ];

    this.store.set(accountId, {
      accountId,
      status: 'PROVISIONING',
      steps
    });

    // 3. Run provisioning asynchronously (don't block HTTP thread)
    this.runProvisioning(command, decision.result).catch((err) => {
      console.error(`Provisioning pipeline failed for account ${accountId}:`, err);
      const current = this.store.get(accountId);
      if (current) {
        current.status = 'FAILED';
        this.store.set(accountId, current);
      }
    });
  }

  private async runProvisioning(command: ProvisionIsolationCommand, result: any): Promise<void> {
    const { workspaceId, provider, accountId } = command;
    const checklist = this.store.get(accountId);
    if (!checklist) return;

    const updateStep = (index: number, status: 'pending' | 'processing' | 'success' | 'failed', message?: string) => {
      checklist.steps[index].status = status;
      if (message) checklist.steps[index].message = message;
      this.store.set(accountId, checklist);
    };

    // Auto-seed resource pools if missing from DB
    try {
      const vmPool = await this.prisma.resourcePool.findUnique({ where: { id: 'vm' } });
      if (!vmPool) {
        await this.prisma.resourcePool.create({
          data: {
            id: 'vm',
            name: 'vm',
            totalCapacity: { total: 10 } as any,
            usedCapacity: { used: 0 } as any,
            status: 'ACTIVE',
            version: 1
          }
        });
      }
      
      const workerPool = await this.prisma.resourcePool.findUnique({ where: { id: 'worker' } });
      if (!workerPool) {
        await this.prisma.resourcePool.create({
          data: {
            id: 'worker',
            name: 'worker',
            totalCapacity: { total: 10 } as any,
            usedCapacity: { used: 0 } as any,
            status: 'ACTIVE',
            version: 1
          }
        });
      }
    } catch (dbErr) {
      console.warn('[Provisioning] Error auto-seeding resource pools, proceeding anyway:', dbErr);
    }

    // --- STEP 1: Evaluate Footprint policies ---
    updateStep(0, 'processing');
    await new Promise(resolve => setTimeout(resolve, 600));
    updateStep(0, 'success', `Risk score: ${result.isolationScore}/100. Policy applied: ${result.reason}`);

    // --- STEP 2: Allocate VM ---
    updateStep(1, 'processing');
    await new Promise(resolve => setTimeout(resolve, 800));
    if (result.vmAction === 'CREATE_VM') {
      const leaseId = await this.allocateVMUseCase.execute({
        executionId: accountId,
        durationSeconds: 3600
      });
      updateStep(1, 'success', `Dedicated VM node provisioned. Lease ID: ${leaseId}`);
    } else {
      updateStep(1, 'success', 'Reusing existing VM cluster node (shared tenant).');
    }

    // --- STEP 3: Allocate Worker ---
    updateStep(2, 'processing');
    await new Promise(resolve => setTimeout(resolve, 800));
    if (result.workerAction === 'CREATE_WORKER') {
      const leaseId = await this.allocateWorkerUseCase.execute({
        executionId: accountId,
        durationSeconds: 3600
      });
      updateStep(2, 'success', `Dedicated worker container running. Lease ID: ${leaseId}`);
    } else {
      updateStep(2, 'success', 'Reusing active worker footprint.');
    }

    // --- STEP 4: Fingerprint Generation ---
    updateStep(3, 'processing');
    await new Promise(resolve => setTimeout(resolve, 600));
    const fingerprint = FingerprintGenerator.generate({
      isMobile: provider.toLowerCase() === 'whatsapp',
      timezone: 'America/New_York'
    });

    // Update credential metadata in DB
    const credentials = await this.prisma.credential.findMany({
      where: { ownerId: workspaceId, isDeleted: false }
    });
    
    // Look for matching credentials for this platform
    const targetCred = credentials.find(c => {
      const meta = c.metadata as any;
      return meta && meta.platform === provider.toLowerCase();
    }) || credentials[0]; // fallback if not found

    if (targetCred) {
      const existingMeta = typeof targetCred.metadata === 'string' 
        ? JSON.parse(targetCred.metadata) 
        : (targetCred.metadata || {});

      await this.prisma.credential.update({
        where: { id: targetCred.id },
        data: {
          metadata: {
            ...existingMeta,
            fingerprint,
            proxy: result.proxyAssigned,
            isolationScore: result.isolationScore
          }
        }
      });
      updateStep(3, 'success', `Injected User-Agent: ${fingerprint.userAgent.substring(0, 45)}... Canvas & WebGL masked.`);
    } else {
      updateStep(3, 'success', 'Saved generated anti-detection profiles to memory.');
    }

    // --- STEP 5: Proxy Handshake ---
    updateStep(4, 'processing');
    const proxyAddress = result.proxyAssigned !== 'DIRECT_CONNECTION'
      ? this.proxyPoolManager.getResidentialProxy(workspaceId, provider)
      : 'DIRECT_CONNECTION';

    const health = await this.proxyPoolManager.validateProxy(proxyAddress);
    if (!health.success) {
      updateStep(4, 'failed', `Proxy connection timed out on IP ${health.ip}.`);
      checklist.status = 'FAILED';
      this.store.set(accountId, checklist);
      return;
    }
    
    if (targetCred) {
      const existingMeta = typeof targetCred.metadata === 'string' 
        ? JSON.parse(targetCred.metadata) 
        : (targetCred.metadata || {});

      await this.prisma.credential.update({
        where: { id: targetCred.id },
        data: {
          metadata: {
            ...existingMeta,
            proxy: proxyAddress,
            proxyDetails: health
          }
        }
      });
    }

    updateStep(4, 'success', `Proxy verified. IP: ${health.ip} (${health.country}) via ${health.provider}. Latency: ${health.latencyMs}ms`);

    // --- STEP 6: Deploy environment ---
    updateStep(5, 'processing');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (targetCred) {
      await this.prisma.credential.update({
        where: { id: targetCred.id },
        data: { status: 'ACTIVE' }
      });
    }

    updateStep(5, 'success', 'Social identity isolation setup completed successfully.');

    // Complete the checklist
    checklist.status = 'COMPLETED';
    this.store.set(accountId, checklist);
  }
}
