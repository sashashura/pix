require('dotenv').config();
const logger = require('../../../lib/infrastructure/logger');
const { knex } = require('../../../db/knex-database-connection');
const TABLE_NAME = "answers";

async function alterTableAnswerColumnIdTypeFromIntToBigint(knex) {
  await knex.transaction(async (trx) => {
    await knex.raw('alter table answers alter column id SET DATA TYPE BIGINT').transacting(trx);
  });
};

const isLaunchedFromCommandLine = require.main === module;

async function main() {
  logger.info(`Start script ${__filename}... `);
  await alterTableAnswerColumnIdTypeFromIntToBigint(knex);
  logger.info('End script');
}

if (isLaunchedFromCommandLine) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}

module.exports = { alterTableAnswerColumnIdTypeFromIntToBigint };
