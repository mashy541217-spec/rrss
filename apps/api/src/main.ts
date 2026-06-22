import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infrastructure/common/filters/GlobalExceptionFilter';
import { LoggerService } from '@rrss-auto/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.info(`RRSS AUTO API is running on: http://localhost:${port}`);
}

bootstrap();
