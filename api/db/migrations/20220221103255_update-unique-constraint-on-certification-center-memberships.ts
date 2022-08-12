// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table('certification-center-memberships', function (table: $TSFixMe) {
    table.dropUnique(['userId', 'certificationCenterId']);
  });
  return knex.raw(
    'CREATE UNIQUE INDEX "certification-center-memberships_userid_certificationcenterid_disabledAt_unique" ON "certification-center-memberships" ("userId", "certificationCenterId") WHERE "disabledAt" IS NULL;'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table('certification-center-memberships', function (table: $TSFixMe) {
    table.dropUnique(null, 'certification-center-memberships_userid_certificationcenterid_disabledAt_unique');
    table.unique(['userId', 'certificationCenterId']);
  });
};
