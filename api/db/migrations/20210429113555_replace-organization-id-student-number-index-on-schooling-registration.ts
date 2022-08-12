// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'schooling-registrations';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw('DROP INDEX "organizationid_studentnumber_index"');
  await knex.raw('DROP INDEX "organizationid_studentnumber_notsupernumerary_index"');

  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.unique(['studentNumber', 'organizationId']);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw(
    'CREATE INDEX "organizationid_studentnumber_index" ON "schooling-registrations" ("organizationId", "studentNumber");'
  );
  await knex.raw(
    'CREATE UNIQUE INDEX "organizationid_studentnumber_notsupernumerary_index" ON "schooling-registrations" ("organizationId", "studentNumber") WHERE "isSupernumerary" IS FALSE;'
  );

  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropUnique(['studentNumber', 'organizationId']);
  });
};
