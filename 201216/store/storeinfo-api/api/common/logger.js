const log4js = require('log4js');
const config = require('config');

const logconf = {
  log4js: {
    categories: {
      system: {
        appenders: ['system'],
        level: config.log.level,
      },
      access: {
        appenders: ['access'],
        level: config.log.level,
      },
      default: {
        appenders: ['system'],
        level: config.log.level,
      },
      console: {
        appenders: ['console'],
        level: config.log.level,
      },
    },
    appenders: {
      system: {
        type: 'dateFile',
        filename: './log/system.log',
        compress: true,
        daysToKeep: config.log.daysToKeep * 2 - 1,
        alwaysIncludePattern: true,
        keepFileExt: true,
      },
      access: {
        type: 'dateFile',
        filename: './log/access.log',
        compress: true,
        daysToKeep: config.log.daysToKeep * 2 - 1,
        alwaysIncludePattern: true,
        keepFileExt: true,
      },
      console: {
        type: 'console',
      },
    },
  },
};

log4js.configure(logconf.log4js);

module.exports = {
  system: log4js.getLogger('system'),
  access: log4js.getLogger('access'),
  console: log4js.getLogger('console'),
  express: log4js.connectLogger(log4js.getLogger('access')),
  shutdown: log4js.shutdown,
};
