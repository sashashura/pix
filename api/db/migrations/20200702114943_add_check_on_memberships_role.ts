// Switching to raw SQL, because knex can't add CHECK constraint on existing column
// https://github.com/knex/knex/issues/1699

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.raw(
    'ALTER TABLE memberships ADD CONSTRAINT "memberships_organizationRole_check" CHECK ( "organizationRole" IN (\'ADMIN\', \'MEMBER\' ) )'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE memberships DROP CONSTRAINT "memberships_organizationRole_check" ');
};
