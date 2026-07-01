import { Controller, Post, Get, Body, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublishingService } from './publishing.service';
import { PublicationQueueService } from './publication-queue.service';
import { PublicationWorkerService } from './publication-worker.service';

@Controller('publishing')
export class PublishingController {
  constructor(
    private readonly publishingService: PublishingService,
    private readonly queue: PublicationQueueService,
    private readonly worker: PublicationWorkerService,
  ) {}

  // ─── Asset Upload ────────────────────────────────────────────────────────
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body('workspaceId') workspaceId: string,
    @Body('businessId') businessId: string,
  ) {
    return this.publishingService.uploadAsset(file, workspaceId, businessId);
  }

  // ─── Draft ────────────────────────────────────────────────────────────────
  @Post('draft')
  async createDraft(@Body() body: any) {
    return this.publishingService.createDraft(body);
  }

  // ─── Publish (enqueues immediately or schedules) ─────────────────────────
  @Post('publish')
  async publish(@Body() body: any) {
    return this.publishingService.publish(body);
  }

  // ─── History ──────────────────────────────────────────────────────────────
  @Get('history')
  async getHistory(@Query('workspaceId') workspaceId: string) {
    return this.publishingService.getHistory(workspaceId);
  }

  // ─── Publication Status ───────────────────────────────────────────────────
  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.publishingService.getStatus(id);
  }

  // ─── Retry ────────────────────────────────────────────────────────────────
  @Post('retry')
  async retry(@Body('publicationId') publicationId: string) {
    return this.publishingService.retry(publicationId);
  }

  // ─── Delete (cancel) ─────────────────────────────────────────────────────
  @Post('delete')
  async deletePublication(@Body('publicationId') publicationId: string) {
    return this.publishingService.deletePublication(publicationId);
  }

  // ─── Synchronize (manual trigger from social hub) ─────────────────────────
  @Post('synchronize')
  async synchronize(@Body('credentialId') credentialId: string) {
    // Re-exported for convenience — actual impl lives in SocialModule
    return { success: true, message: 'Use /api/social/synchronize for credential sync' };
  }

  // ─── Queue Stats ─────────────────────────────────────────────────────────
  @Get('queue')
  async getQueueStats() {
    const depth = await this.queue.getQueueDepth();
    const workerStatus = this.worker.getStatus();
    return {
      queue: depth.queue,
      scheduled: depth.scheduled,
      dlq: depth.dlq,
      worker: workerStatus,
    };
  }

  // ─── Scheduled Publications ───────────────────────────────────────────────
  @Get('scheduled')
  async getScheduled() {
    return this.queue.getScheduledEntries();
  }

  // ─── Dead Letter Queue ────────────────────────────────────────────────────
  @Get('dlq')
  async getDlq() {
    return this.queue.getDlqEntries();
  }

  // ─── Worker Status ────────────────────────────────────────────────────────
  @Get('worker/status')
  async getWorkerStatus() {
    return this.worker.getStatus();
  }
}
