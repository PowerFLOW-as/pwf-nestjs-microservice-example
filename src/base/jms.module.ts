import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as stompit from 'stompit';

const crypto = require('crypto');

function isMultipleServersDividedByComma(hostsDividedByComma: string) {
  return hostsDividedByComma?.indexOf(',') && hostsDividedByComma.indexOf(',') > -1;
}

function parseStompConfig(config: ConfigService<Record<string, unknown>, any>) {
  const hostsDividedByComma: string = config.get('stomp.host') || 'localhost';
  const heartBeat: string = config.get('stomp.heartBeat') || '5000,5000';
  const stompServerArray = [];
  const stompPort = config.get('stomp.port') || 61613;

  if (isMultipleServersDividedByComma(hostsDividedByComma)) {
    // prepare multiple stomp servers (Artemis)
    const splitStopServers = hostsDividedByComma.split(',');
    for (let i = 0; i < splitStopServers.length; i++) {
      const newServer = {
        host: splitStopServers[i],
        port: stompPort,
        connectHeaders: {
          login: config.get('stomp.connectHeaders.login'),
          passcode: config.get('stomp.connectHeaders.passcode'),
          'heart-beat': heartBeat,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          'client-id': `BDS-MS-${crypto.randomUUID()}`,
        },
      };
      stompServerArray.push(newServer);
    }
  } else {
    // prepare just one stomp server (ActiveMQ)
    const stompServer = {
      host: hostsDividedByComma ? hostsDividedByComma : 'localhost',
      port: stompPort,
      // connectHeaders: stompConnectHeaders, // connectHeaders are used only in artemis
    };
    stompServerArray.push(stompServer);
  }

  return stompServerArray;
}

@Module({
  imports: [],
  providers: [
    {
      provide: 'JMS_CONNECTION',
      useFactory: (config: ConfigService) => {
        const stompServerArray = parseStompConfig(config);
        Logger.debug(`Stomp configuration: ${JSON.stringify(stompServerArray)}`);

        const connectionManager: stompit.ConnectFailover = new stompit.ConnectFailover(stompServerArray, {
          initialReconnectDelay: 100,
          maxReconnects: 10,
        });

        connectionManager.on('error', function (error: any) {
          const connectArgs = error.connectArgs;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          const address = connectArgs.host + ':' + connectArgs.port;
          Logger.debug(`Could not connect to ${address} : ${error.message}`);
        });

        connectionManager.on('connecting', function (connector: any) {
          Logger.debug(`Connecting to ${connector.serverProperties.remoteAddress.transportPath}`);
        });

        connectionManager.on('connect', function () {
          Logger.debug(`Successfully connected to STOMP!`);
        });
        return new stompit.ChannelPool(connectionManager);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['JMS_CONNECTION'],
})
export class JmsModule {}
