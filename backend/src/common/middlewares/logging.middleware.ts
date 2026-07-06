import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 9)}`;
    req.headers['x-request-id'] = requestId;

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const method = req.method;
      const url = req.originalUrl || req.url;

      // Extract user info from request if authenticated by JWT guard
      const user = (req as any).user;
      const userId = user?.sub || 'anonymous';
      const role = user?.role || 'none';

      this.logger.log(
        `[${requestId}] ${method} ${url} Status:${statusCode} Time:${duration}ms User:${userId} Role:${role}`
      );
    });

    next();
  }
}
