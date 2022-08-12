// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../lib/infrastructure/caches/learning-content-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, disconnect } = require('../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'doSomethin... Remove this comment to see the full error message
const doSomething = async ({
  throwError
}: $TSFixMe) => {
  if (throwError) {
    throw new Error('An error occurred');
  }
  const data = await knex.select('id').from('users').first();
  return data;
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isLaunched... Remove this comment to see the full error message
const isLaunchedFromCommandLine = require.main === module;

// @ts-expect-error TS(2393): Duplicate function implementation.
async function main() {
  const startTime = performance.now();
  // @ts-expect-error TS(2304): Cannot find name '__filename'.
  logger.info(`Script ${__filename} has started`);
  await doSomething({ throwError: false });
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  logger.info(`Script has ended: took ${duration} milliseconds`);
}

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    } catch (error) {
      logger.error(error);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exitCode = 1;
    } finally {
      await disconnect();
      cache.quit();
    }
  }
})();

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { doSomething };
