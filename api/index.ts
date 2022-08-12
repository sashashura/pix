// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const validateEnvironmentVariables = require('./lib/infrastructure/validate-environement-variables');
validateEnvironmentVariables();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('./server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('./lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'disconnect... Remove this comment to see the full error message
const { disconnect } = require('./db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'server'.
let server: $TSFixMe;

const start = async function () {
  server = await createServer();
  await server.start();
};

async function _exitOnSignal(signal: $TSFixMe) {
  logger.info(`Received signal: ${signal}.`);
  logger.info('Stopping HAPI server...');
  await server.stop({ timeout: 30000 });
  logger.info('Closing connexions to database...');
  await disconnect();
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  // eslint-disable-next-line node/no-process-exit
  process.exit();
}

// @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
process.on('SIGTERM', () => {
  _exitOnSignal('SIGTERM');
});
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.on('SIGINT', () => {
  _exitOnSignal('SIGINT');
});

(async () => {
  try {
    await start();
  } catch (error) {
    logger.error(error);
    throw error;
  }
})();
