// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'account-recovery-demands';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.alterTable(TABLE_NAME, (t: $TSFixMe) => {
    t.integer('userId').alter();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.alterTable(TABLE_NAME, (t: $TSFixMe) => {
    t.string('userId').alter();
  });
};
