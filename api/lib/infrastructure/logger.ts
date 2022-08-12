// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pino = require('pino');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { logging: logSettings } = require('../config');

let prettyPrint;
if (logSettings.logForHumans) {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  // eslint-disable-next-line node/no-unpublished-require
  const pretty = require('pino-pretty');
  const omitDay = 'HH:MM:ss';
  prettyPrint = pretty({
    sync: true,
    colorize: true,
    translateTime: omitDay,
    ignore: 'pid,hostname',
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = pino(
  {
    level: logSettings.logLevel,
    redact: ['req.headers.authorization'],
    enabled: logSettings.enabled,
  },
  prettyPrint
);

logger.error('ERROR logs enabled');
logger.warn('WARN logs enabled');
logger.info('INFO logs enabled');
logger.debug('DEBUG logs enabled');
logger.trace('TRACE logs enabled');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = logger;
