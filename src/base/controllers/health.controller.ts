import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';

import { Public } from '../../common';

/**
 * https://docs.nestjs.com/recipes/terminus
 */
@Controller()
export class HealthController {
  constructor(
    private db: MongooseHealthIndicator,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private config: ConfigService<Record<string, unknown>, any>,
  ) {}

  // @Public()
  // @Get('health')
  // @HealthCheck()
  // public async healthCheck(): Promise<HealthCheckResult> {
  //   return this.health.check([async (): Promise<HealthIndicatorResult> => this.http.pingCheck('dns', 'https://1.1.1.1')]);
  // }

  // @Public()
  // @Get('live')
  // @HealthCheck()
  // public async liveCheck(): Promise<HealthCheckResult> {
  //   return this.health.check([async (): Promise<HealthIndicatorResult> => this.http.pingCheck('dns', 'http://localhost:3000')]);
  // }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Get('live')
  public async liveCheck(): Promise<string> {
    return 'OK';
  }

  @Public()
  @Get('ready')
  @HealthCheck()
  public async readyCheck(): Promise<HealthCheckResult> {
    // const stompPort: number = this.config.get('stomp.port') || 61613;
    const mongodbUri: string = this.config.get('mongodb.uri') || '';

    return this.health.check([
      // () => this.http.pingCheck('DNS check', 'https://1.1.1.1'),
      () => this.http.pingCheck('Service live check', 'http://localhost:3000/live'),
      // () => this.http.pingCheck('JMS check', stompPort.toString()),
      () => this.http.pingCheck('MongoDB URI ping', mongodbUri),
      () => this.db.pingCheck(mongodbUri),
    ]);
  }
}
