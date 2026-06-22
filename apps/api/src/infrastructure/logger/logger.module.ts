import { Module, Global } from '@nestjs/common';
import { ConsoleLogger, ILogger, LogLevel } from '@rrss-auto/logger';

@Global()
@Module({
  providers: [
    {
      provide: 'ILogger',
      useValue: new ConsoleLogger(LogLevel.DEBUG),
    },
  ],
  exports: ['ILogger'],
})
export class AppLoggerModule {}
