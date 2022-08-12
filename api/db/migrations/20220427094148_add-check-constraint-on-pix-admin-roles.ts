// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.raw(
    "ALTER TABLE \"pix-admin-roles\" ADD CONSTRAINT \"pix-admin-roles_role_check\" CHECK ( \"role\" IN ('SUPER_ADMIN', 'SUPPORT', 'METIER', 'CERTIF') )"
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE "pix-admin-roles" DROP CONSTRAINT "pix-admin-roles_role_check"');
};
