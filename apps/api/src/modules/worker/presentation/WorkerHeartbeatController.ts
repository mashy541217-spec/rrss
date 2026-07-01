import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { WorkerRegistryService } from '../application/WorkerRegistryService';
import { WorkerInfo, WorkerStatus } from '../domain/WorkerTypes';

@Controller('workers')
export class WorkerHeartbeatController {
  private readonly logger = new Logger(WorkerHeartbeatController.name);

  constructor(private readonly registryService: WorkerRegistryService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  registerWorker(@Body() workerInfo: any) {
    // In a real scenario, this would check JWT scope
    const newWorker: WorkerInfo = {
      id: workerInfo.id,
      version: workerInfo.version || '1.0.0',
      status: WorkerStatus.Idle,
      capabilities: workerInfo.capabilities || [],
      tags: workerInfo.tags || [],
      labels: workerInfo.labels || {},
      lastHeartbeat: new Date(),
      metrics: {
        cpu: 0,
        ram: 0,
        runningJobs: 0,
        queueLength: 0,
        latency: 0,
      }
    };
    this.registryService.registerWorker(newWorker);
    return { success: true, message: 'Worker registered successfully' };
  }

  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  receiveHeartbeat(@Body() payload: { id: string; metrics: any }) {
    this.registryService.recordHeartbeat(payload.id, payload.metrics);
    return { success: true };
  }
}
