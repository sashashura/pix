// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgClient'.
const PgClient = require('../PgClient');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_DUPL... Remove this comment to see the full error message
const { PGSQL_DUPLICATE_DATABASE_ERROR } = require('../../db/pgsql-errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dbUrl'.
const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'url'.
const url = new URL(dbUrl);

const DB_TO_CREATE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    await client.query_and_log(`CREATE DATABASE ${DB_TO_CREATE_NAME};`);
    logger.info('Database created');
    await client.end();
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    process.exit(0);
  } catch (error) {
    if ((error as $TSFixMe).code === PGSQL_DUPLICATE_DATABASE_ERROR) {
      logger.info(`Database ${DB_TO_CREATE_NAME} already created`);
      await client.end();
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(0);
    }
  }
});
