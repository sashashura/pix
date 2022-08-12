// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-courses';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'verificationCode';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(COLUMN_NAME);
  });
  await knex.raw('CREATE UNIQUE INDEX index_certification_courses_upper_verification_code ON ?? (UPPER(??))', [
    'certification-courses',
    'verificationCode',
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw('DROP INDEX index_certification_courses_upper_verification_code');
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
