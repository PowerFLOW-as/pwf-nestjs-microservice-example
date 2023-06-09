import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from '../auth';

import * as controllers from './controllers';
import { JmsModule } from './jms.module';
import { DatabaseModule } from './mongo.module';
import { Test, TestSchema } from './schemas/test.schema';

@Module({
  imports: [
    TerminusModule,
    AuthModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Test.name,
        schema: TestSchema,
      },
    ]),
    DatabaseModule,
    JmsModule,
  ],
  controllers: Object.values(controllers),
  providers: [],
})
export class BaseModule {}
