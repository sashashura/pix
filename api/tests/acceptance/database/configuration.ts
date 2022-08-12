// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const parsePostgresqlConnectionString = require('pg-connection-string').parse;

const databaseToLint = {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  connexion: parsePostgresqlConnectionString(process.env.TEST_DATABASE_URL),
  schema: [{ name: 'public' }],
};

const rules = {
  settings: {
    'name-inflection': ['error', 'plural'],
  },
  ignores: [
    { identifierPattern: 'public\\.knex*.*', rulePattern: '.*' },
    { identifierPattern: 'public\\.badge-criteria', rulePattern: 'name-inflection' },
  ],
};

const configuration = {
  connection: databaseToLint.connexion,
  schemas: databaseToLint.schema,
  rules: rules.settings,
  ignores: rules.ignores,
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = configuration;
