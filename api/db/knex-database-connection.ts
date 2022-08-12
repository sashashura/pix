// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'types'.
const types = require('pg').types;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const { get } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../lib/infrastructure/monitoring-tools');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { logging } = require('../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');
/*
By default, node-postgres casts a DATE value (PostgreSQL type) as a Date Object (JS type).
But, when dealing with dates with no time (such as birthdate for example), we want to
deal with a 'YYYY-MM-DD' string.
*/
types.setTypeParser(types.builtins.DATE, (value: $TSFixMe) => value);

/*
The method Bookshelf.Model.count(), used with PostgreSQL, can sometimes returns a BIGINT.
This is not the common case (maybe in several years).
Even though, Bookshelf/Knex have decided to return String.
We decided to parse the result of #count() method to force a resulting INTEGER.

Links :
- problem: https://github.com/bookshelf/bookshelf/issues/1275
- solution: https://github.com/brianc/node-pg-types
 */
types.setTypeParser(types.builtins.INT8, (value: $TSFixMe) => parseInt(value));

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const knexConfigs = require('./knexfile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { environment } = require('../lib/config');

/* QueryBuilder Extension */
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Knex = require('knex');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const QueryBuilder = require('knex/lib/query/querybuilder');

try {
  Knex.QueryBuilder.extend('whereInArray', function(this: $TSFixMe, column: $TSFixMe, values: $TSFixMe) {
    return this.where(column, knex.raw('any(?)', [values]));
  });
} catch (e) {
  if ((e as $TSFixMe).message !== "Can't extend QueryBuilder with existing method ('whereInArray').") {
    logger.error(e);
  }
}
/* -------------------- */

const knexConfig = knexConfigs[environment];
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const knex = require('knex')(knexConfig);

const originalToSQL = QueryBuilder.prototype.toSQL;
QueryBuilder.prototype.toSQL = function () {
  const ret = originalToSQL.apply(this);
  const request = monitoringTools.getInContext('request');
  const comments = [['path', get(request, 'route.path')]].map((comment) => comment.join(': ')).join(' ');
  ret.sql = `/* ${comments} */ `.concat(ret.sql);
  return ret;
};

knex.on('query', function (data: $TSFixMe) {
  if (logging.enableLogKnexQueries) {
    monitoringTools.setInContext(`knexQueryStartTimes.${data.__knexQueryUid}`, performance.now());
  }
});

knex.on('query-response', function (response: $TSFixMe, obj: $TSFixMe) {
  if (logging.enableLogKnexQueries) {
    const queryStartedTime = monitoringTools.getInContext(`knexQueryStartTimes.${obj.__knexQueryUid}`);
    if (queryStartedTime) {
      const duration = performance.now() - queryStartedTime;

      monitoringTools.incrementInContext('metrics.knexQueryCount');
      monitoringTools.pushInContext('metrics.knexQueries', {
        id: obj.__knexQueryUid,
        sql: obj.sql,
        duration,
      });
    }
  }
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'disconnect... Remove this comment to see the full error message
async function disconnect() {
  return knex.destroy();
}

const _databaseName = knex.client.database();

const _dbSpecificQueries = {
  listTablesQuery:
    'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?',
  emptyTableQuery: 'TRUNCATE ',
};

async function listAllTableNames() {
  const bindings = [_databaseName];

  const resultSet = await knex.raw(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?',
    bindings
  );

  const rows = resultSet.rows;
  return _.map(rows, 'table_name');
}

async function emptyAllTables() {
  const tableNames = await listAllTableNames();
  const tablesToDelete = _.without(tableNames, 'knex_migrations', 'knex_migrations_lock');

  const tables = _.map(tablesToDelete, (tableToDelete: $TSFixMe) => `"${tableToDelete}"`).join();

  const query = _dbSpecificQueries.emptyTableQuery;
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(`${query}${tables}`);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  knex,
  disconnect,
  emptyAllTables,
};
