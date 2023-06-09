export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || '',
  },
  stomp: {
    host: process.env.STOMP_HOST || 'localhost', // Multiple servers e.g. 'n6.powerflow.cloud,n7.powerflow.cloud'
    port: process.env.STOMP_PORT || 61613, // localhost: 61613, devel2 tunnel: 61616
    heartBeat: process.env.STOMP_HEARTBEAT || '5000,5000', // used only with multiple servers (artemis)
    connectHeaders: {
      login: process.env.STOMP_LOGIN || '', // used only with multiple servers (artemis)
      passcode: process.env.STOMP_PASSCODE || '', // used only with multiple servers (artemis)
    },
  },
  pwf: {
    service: {
      uri: process.env.PWF_SERVICE_URI || '',
    },
  },
};
