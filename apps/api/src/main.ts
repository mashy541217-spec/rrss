import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infrastructure/common/filters/GlobalExceptionFilter';
import { ILogger } from '@rrss-auto/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  // Restrict CORS to known frontend origins (set ALLOWED_ORIGINS in production)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5175', 'http://localhost:5174'];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  const logger = app.get<ILogger>('ILogger');
  app.useLogger(logger as any);

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
