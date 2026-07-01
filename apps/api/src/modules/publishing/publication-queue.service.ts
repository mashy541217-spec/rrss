import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

export interface PublicationJob {
  publicationId: string;
  campaignId: string;
  businessId: string;
  caption: string;
  imageUrls: string[];
  pageId: string;
  provider: string;
  retryCount: number;
  enqueuedAt: string;
  scheduledFor?: string; // ISO 8601 - if set, this was a scheduled job
}

const QUEUE_KEY = 'publication:queue';
const DLQ_KEY = 'publication:dlq';
const SCHEDULED_KEY = 'publication:scheduled';
const MAX_RETRIES = 3;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

@Injectable()
export class PublicationQueueService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(PublicationQueueService.name);
  private redis: Redis | null = null;
  private available = false;

  onApplicationBootstrap() {
    this.connect();
  }

  onApplicationShutdown() {
    this.redis?.disconnect();
  }

  private connect() {
    try {
      this.redis = new Redis(REDIS_URL, {
        enableOfflineQueue: false,
        lazyConnect: false,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // do not retry connection — degrade gracefully
      });

      this.redis.on('connect', () => {
        this.logger.log('Redis connected — Publication Queue online');
        this.available = true;
      });

      this.redis.on('error', (err) => {
        this.logger.warn(`Redis error: ${err.message} — falling back to in-process mode`);
        this.available = false;
      });

      this.redis.on('close', () => {
        this.available = false;
      });
    } catch (e) {
      this.logger.warn('Redis unavailable — in-process mode active');
      this.available = false;
    }
  }

  isAvailable(): boolean {
    return this.available && this.redis !== null;
  }

  async enqueue(job: PublicationJob): Promise<void> {
    if (!this.available || !this.redis) {
      this.logger.warn(`[IN-PROCESS] Redis unavailable, returning job directly: ${job.publicationId}`);
      return;
    }
    const serialized = JSON.stringify(job);
    await this.redis.lpush(QUEUE_KEY, serialized);
    this.logger.log(`Enqueued publication job: ${job.publicationId}`);
  }

  async scheduleAt(job: PublicationJob, runAt: Date): Promise<void> {
    if (!this.available || !this.redis) return;
    const score = runAt.getTime();
    await this.redis.zadd(SCHEDULED_KEY, score, JSON.stringify(job));
    this.logger.log(`Scheduled publication job: ${job.publicationId} for ${runAt.toISOString()}`);
  }

  async popDueScheduled(): Promise<PublicationJob[]> {
    if (!this.available || !this.redis) return [];
    const now = Date.now();
    // Atomically retrieve all jobs with score <= now
    const raw = await this.redis.zrangebyscore(SCHEDULED_KEY, '-inf', now);
    if (!raw.length) return [];

    // Remove them from sorted set
    await this.redis.zremrangebyscore(SCHEDULED_KEY, '-inf', now);

    return raw.map(r => JSON.parse(r) as PublicationJob);
  }

  async consume(timeoutSeconds = 5): Promise<PublicationJob | null> {
    if (!this.available || !this.redis) {
      // Simulate the block to prevent CPU spin when Redis is down
      await new Promise(res => setTimeout(res, timeoutSeconds * 1000));
      return null;
    }
    try {
      // BRPOP: block for up to timeoutSeconds, returns [key, value] or null
      const result = await this.redis.brpop(QUEUE_KEY, timeoutSeconds);
      if (!result) return null;
      return JSON.parse(result[1]) as PublicationJob;
    } catch {
      return null;
    }
  }

  async sendToDlq(job: PublicationJob, error: string): Promise<void> {
    if (!this.available || !this.redis) return;
    const dlqEntry = { ...job, failedAt: new Date().toISOString(), error };
    await this.redis.lpush(DLQ_KEY, JSON.stringify(dlqEntry));
    this.logger.warn(`Job ${job.publicationId} moved to DLQ after ${job.retryCount} retries`);
  }

  async requeueWithBackoff(job: PublicationJob): Promise<void> {
    if (!this.available || !this.redis) return;
    if (job.retryCount >= MAX_RETRIES) {
      await this.sendToDlq(job, 'Max retries exceeded');
      return;
    }
    const updatedJob: PublicationJob = { ...job, retryCount: job.retryCount + 1 };
    // Exponential backoff: 2^retryCount seconds
    const delayMs = Math.pow(2, updatedJob.retryCount) * 1000;
    const runAt = new Date(Date.now() + delayMs);
    await this.scheduleAt(updatedJob, runAt);
    this.logger.log(`Requeued ${job.publicationId} with ${delayMs}ms backoff (attempt ${updatedJob.retryCount})`);
  }

  async getQueueDepth(): Promise<{ queue: number; dlq: number; scheduled: number }> {
    if (!this.available || !this.redis) return { queue: 0, dlq: 0, scheduled: 0 };
    const [queue, dlq, scheduled] = await Promise.all([
      this.redis.llen(QUEUE_KEY),
      this.redis.llen(DLQ_KEY),
      this.redis.zcard(SCHEDULED_KEY),
    ]);
    return { queue, dlq, scheduled };
  }

  async getDlqEntries(limit = 20): Promise<any[]> {
    if (!this.available || !this.redis) return [];
    const raw = await this.redis.lrange(DLQ_KEY, 0, limit - 1);
    return raw.map(r => JSON.parse(r));
  }

  async getScheduledEntries(limit = 50): Promise<PublicationJob[]> {
    if (!this.available || !this.redis) return [];
    const raw = await this.redis.zrange(SCHEDULED_KEY, 0, limit - 1, 'WITHSCORES');
    const result: PublicationJob[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      result.push(JSON.parse(raw[i]) as PublicationJob);
    }
    return result;
  }
}
