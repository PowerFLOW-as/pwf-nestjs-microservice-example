import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { Logger } from './common';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 * https://github.com/nestjs/nest/issues/2249#issuecomment-494734673
 */
async function bootstrap(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(await app.resolve(Logger));
  // https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true, // transform object to DTO class
    }),
  );

  if (isProduction) {
    app.enable('trust proxy');
  }

  // Express Middleware
  middleware(app);

  // This enable too large requests (default is 100kb)
  app.use(bodyParser.json({ limit: '3mb' }));
  app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }));

  await app.listen(process.env.PORT || 3000);

  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
