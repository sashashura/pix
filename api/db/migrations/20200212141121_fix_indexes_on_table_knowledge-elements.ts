// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'knowledge-elements';
const SKILLID_COLUMN = 'skillId';
const ANSWERID_COLUMN = 'answerId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ASSESSMENT... Remove this comment to see the full error message
const ASSESSMENTID_COLUMN = 'assessmentId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COMPETENCE... Remove this comment to see the full error message
const COMPETENCEID_COLUMN = 'competenceId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropIndex(SKILLID_COLUMN);
    table.dropIndex(ANSWERID_COLUMN);
    table.dropIndex(ASSESSMENTID_COLUMN);
    table.dropIndex(COMPETENCEID_COLUMN);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.index(SKILLID_COLUMN);
    table.index(ANSWERID_COLUMN);
    table.index(ASSESSMENTID_COLUMN);
    table.index(COMPETENCEID_COLUMN);
  });
};
