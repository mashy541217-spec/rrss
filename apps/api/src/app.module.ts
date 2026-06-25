import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './infrastructure/common/middlewares/LoggingMiddleware';
import { HealthModule } from './infrastructure/health/health.module';
import { PrismaService } from './infrastructure/database/prisma/PrismaService';
import { AppConfigModule } from './infrastructure/configuration/configuration.module';
import { AppLoggerModule } from './infrastructure/logger/logger.module';
import { AppObservabilityModule } from './infrastructure/observability/observability.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { RuntimeModule } from './infrastructure/runtime/RuntimeModule';
import { CredentialModule } from './modules/credentials/CredentialModule';
import { ContentModule } from './modules/content/ContentModule';
import { CampaignModule } from './modules/campaign/CampaignModule';
import { AutomationModule } from './modules/automation/AutomationModule';
import { InstagramModule } from './modules/instagram/instagram.module';
import { FacebookModule } from './modules/facebook/FacebookModule';
import { ThreadsModule } from './modules/threads/ThreadsModule';
import { TelegramModule } from './modules/telegram/TelegramModule';
import { WhatsAppModule } from './modules/whatsapp/WhatsAppModule';
import { MessengerModule } from './modules/messenger/MessengerModule';
import { DiscordModule } from './modules/discord/DiscordModule';
import { SlackModule } from './modules/slack/SlackModule';
import { EnterpriseModule } from './modules/enterprise/EnterpriseModule';
import { OrchestratorModule } from './modules/orchestrator/OrchestratorModule';
import { WorkerModule } from './modules/worker/worker.module';
import { IsolationModule } from './modules/isolation/IsolationModule';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    AppObservabilityModule,
    HealthModule,
    RuntimeModule,
    WorkspaceModule,
    IdentityModule,
    ExecutionModule,
    CredentialModule,
    ContentModule,
    CampaignModule,
    AutomationModule,
    InstagramModule,
    FacebookModule,
    ThreadsModule,
    TelegramModule,
    WhatsAppModule,
    MessengerModule,
    DiscordModule,
    SlackModule,
    EnterpriseModule,
    WorkerModule,
    IsolationModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
