// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knexDataba... Remove this comment to see the full error message
const knexDatabaseConnection = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');

logger.info('Emptying all tables...');
knexDatabaseConnection.emptyAllTables().then(() => {
  logger.info('Done!');
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  process.exit(0);
});
