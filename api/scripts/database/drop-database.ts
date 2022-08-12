// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgClient'.
const PgClient = require('../PgClient');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_NON_... Remove this comment to see the full error message
const { PGSQL_NON_EXISTENT_DATABASE_ERROR } = require('../../db/pgsql-errors');

function isPlatformScalingo() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  return Boolean(process.env.CONTAINER);
}

function preventDatabaseDropAsItCannotBeCreatedAgain() {
  if (isPlatformScalingo()) {
    logger.error('Database will not be dropped, as it would require to recreate the addon');
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    process.exit(1);
  }
}

preventDatabaseDropAsItCannotBeCreatedAgain();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dbUrl'.
const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'url'.
const url = new URL(dbUrl);

const DB_TO_DELETE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    const WITH_FORCE = _withForceOption();
    await client.query_and_log(`DROP DATABASE ${DB_TO_DELETE_NAME}${WITH_FORCE};`);
    logger.info('Database dropped');
    await client.end();
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(0);
  } catch (error) {
    if ((error as $TSFixMe).code === PGSQL_NON_EXISTENT_DATABASE_ERROR) {
      logger.info(`Database ${DB_TO_DELETE_NAME} does not exist`);
      await client.end();
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(0);
    }
  }
});

function _withForceOption() {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  return process.env.FORCE_DROP_DATABASE === 'true' ? ' WITH (FORCE)' : '';
}
