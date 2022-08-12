// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-partner-acquisitions';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  return knex.schema.createTable(TABLE_NAME, (table: $TSFixMe) => {
    table.integer('certificationCourseId').references('certification-courses.id').notNullable().index();
    table.string('partnerKey').references('badges.key').notNullable();
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
