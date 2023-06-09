import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import { Logger } from '../logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private passUrl: string[] = ['/health', '/live', '/ready'];

  constructor(private readonly logger: Logger) {}

  public use(req: Request, res: Response, next: () => void): void {
    if (this.passUrl.includes(req.originalUrl)) {
      return next();
    }

    req.id = req.header('X-Request-Id') || nanoid();
    res.setHeader('X-Request-Id', req.id);
    Logger.setMetadata({ requestId: req.id });

    const user = req.user?.uid || '';
    this.logger.info(`${req.method} ${req.originalUrl} - ${req.ip.replace('::ffff:', '')} ${user}`);

    return next();
  }
}
