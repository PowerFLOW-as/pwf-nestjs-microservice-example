import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino(
  // A good documentation is here: https://github.com/pinojs/pino/blob/HEAD/docs/api.md#base-object
  {
    ...(isProduction
      ? {
          base: undefined,
          level: 'trace',
          formatters: {
            level: (label: any) => ({ level: label }),
          },
          timestamp: pino.stdTimeFunctions.isoTime,
        }
      : {
          level: 'trace',
          transport: {
            // https://github.com/pinojs/pino-pretty
            target: 'pino-pretty',
          },
        }),
  },
  pino.multistream(
    [
      // https://getpino.io/#/docs/asynchronous?id=usage
      { stream: pino.destination({ dest: process.stdout.fd, sync: false }), level: 'trace' },
      { stream: pino.destination({ dest: process.stderr.fd, sync: false }), level: 'error' },
    ],
    {},
  ),
);
