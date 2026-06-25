import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '@rrss-auto/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject('ILogger') private readonly logger: ILogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const duration = Date.now() - startTime;

      this.logger.info(
        `[${method}] ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms - ${userAgent} ${ip}`
      );
    });

    next();
  }
}
