import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterWorkerCommand } from './RegisterWorkerUseCase';
import { HeartbeatWorkerCommand } from './HeartbeatWorkerUseCase';

@WebSocketGateway({ namespace: '/workers' })
export class WorkerGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commandBus: CommandBus) {}

  @SubscribeMessage('register')
  async handleRegister(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const command = new RegisterWorkerCommand(
      data.workerId,
      data.hostname,
      data.version,
      data.platform,
      data.architecture,
      data.installedPlugins,
      data.browserEngines,
      data.aiSupport
    );
    
    await this.commandBus.execute(command);
    client.join(`worker-${data.workerId}`);
    return { status: 'REGISTERED' };
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@MessageBody() data: any) {
    const command = new HeartbeatWorkerCommand(
      data.workerId,
      data.cpuUsagePercent,
      data.ramUsageMb,
      data.totalRamMb,
      data.activeJobs,
      data.browserSessions,
      data.networkLatencyMs,
      data.temperatureCelsius
    );

    await this.commandBus.execute(command);
  }

  handleDisconnect(client: Socket) {
    // In a real app, we would mark the worker associated with this socket as OFFLINE
    // or rely on the RecoverOrphanedJobsService cron to detect the missing heartbeat.
    console.log(`[WorkerGateway] Client disconnected: ${client.id}`);
  }
}
