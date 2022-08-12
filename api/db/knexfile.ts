// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../.env` });

function localPostgresEnv(databaseUrl: $TSFixMe, knexAsyncStacktraceEnabled: $TSFixMe) {
  return {
    client: 'postgresql',
    connection: databaseUrl,
    pool: {
      min: 1,
      max: 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    asyncStackTraces: knexAsyncStacktraceEnabled !== 'false',
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  development: localPostgresEnv(process.env.DATABASE_URL, process.env.KNEX_ASYNC_STACKTRACE_ENABLED),

  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  test: localPostgresEnv(process.env.TEST_DATABASE_URL, process.env.KNEX_ASYNC_STACKTRACE_ENABLED),

  production: {
    client: 'postgresql',
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
      max: parseInt(process.env.DATABASE_CONNECTION_POOL_MAX_SIZE, 10) || 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    asyncStackTraces: process.env.KNEX_ASYNC_STACKTRACE_ENABLED !== 'false',
  },
};
