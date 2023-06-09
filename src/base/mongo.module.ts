import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async (config: ConfigService): Promise<Db> => {
        const mongodbUri: string = config.get('mongodb.uri') || '';
        const client = await MongoClient.connect(mongodbUri);
        Logger.log(`Successfully connected to MongoDB on mongodbUri: ${mongodbUri}`);
        return client.db();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MONGO_CONNECTION'],
})
export class DatabaseModule {}
