// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'competence-evaluations';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COMPETENCE... Remove this comment to see the full error message
const COMPETENCEID_COLUMN = 'competenceId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(COMPETENCEID_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(COMPETENCEID_COLUMN);
  });
};
