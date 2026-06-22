import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './infrastructure/common/middlewares/LoggingMiddleware';
import { HealthModule } from './infrastructure/health/health.module';
import { PrismaService } from './infrastructure/database/prisma/PrismaService';
import { AppConfigModule } from './infrastructure/configuration/configuration.module';
import { AppLoggerModule } from './infrastructure/logger/logger.module';
import { AppObservabilityModule } from './infrastructure/observability/observability.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    AppObservabilityModule,
    HealthModule,
    RedisModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
