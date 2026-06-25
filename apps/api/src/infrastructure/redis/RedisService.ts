import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { IConfigurationProvider } from '@rrss-auto/configuration';
import { ILogger } from '@rrss-auto/logger';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(
    @Inject('IConfigurationProvider') private readonly config: IConfigurationProvider,
    @Inject('ILogger') private readonly logger: ILogger
  ) {}

  onModuleInit() {
    const url = this.config.get('REDIS_URL') || 'redis://localhost:6379';
    this.client = new Redis(url);

    this.client.on('connect', () => {
      this.logger.info('Connected to Redis successfully');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }
}
