import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { BaseModule } from './base';
import { JmsModule } from './base/jms.module';
import { DatabaseModule } from './base/mongo.module';
import { AuthTokenInterceptor, CommonModule, ExceptionsFilter, LoggerMiddleware } from './common';
import { configuration } from './config';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    // Service Modules
    CommonModule, // Global
    BaseModule,
    // Module Router
    // https://docs.nestjs.com/recipes/router-module
    RouterModule.register([]),
    // Mongo
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    DatabaseModule,
    JmsModule,
    AuthTokenInterceptor,
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
