// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'answers';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.alterTable(TABLE_NAME, (t: $TSFixMe) => {
    t.text('value').alter();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.alterTable(TABLE_NAME, (t: $TSFixMe) => {
    t.text('string').alter();
  });
};
