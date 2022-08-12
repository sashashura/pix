// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'knowledge-elements';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (t: $TSFixMe) => {
    t.float('earnedPix').notNullable().defaultTo(0);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (t: $TSFixMe) => {
    t.dropColumn('earnedPix');
  });
};

/* Generating the skill value table:

require('dotenv').config();
const airtable = require('./lib/infrastructure/airtable.js');
const _ = require('lodash');

async function getPixValues() {
  const acquis = await airtable.findRecords('Acquis');  // [ Acquis { … }, … ]
  const byValue = _.groupBy(acquis, 'fields.PixValue'); // { "0": [ Acquis { … }, … ], … }
  const idsByValue = _(byValue)
    .toPairs()                                          // [ [ "0", [ Acquis { … }, … ] ], … ]
    .reject([0, "0"])                                   // [ [ "4.0", [ Acquis { … }, … ] ], … ]
    .sortBy(0)                                          // [ [ "0.5", [ Acquis { … }, … ] ], … ]
    .map(([value, acquis]) => `  "${value}": ${JSON.stringify(_.map(acquis, 'id').sort())},`)
                                                        // [ '"0.5": ["recAvcedefz", …]' ]
    .value();
  console.log(`const acquisByValue = {\n${idsByValue.join('\n')}\n};`);
}

getPixValues().then(()=>{process.exit(0)});

*/
