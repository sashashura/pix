// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw(
    'ALTER TABLE "authentication-methods" DROP CONSTRAINT "authentication_methods_identityProvider_check" '
  );
  return knex.raw(
    "ALTER TABLE \"authentication-methods\" ADD CONSTRAINT \"authentication_methods_identityProvider_check\" CHECK ( \"identityProvider\" IN ('PIX', 'GAR', 'POLE_EMPLOI', 'CNAV') )"
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw(
    'ALTER TABLE "authentication-methods" DROP CONSTRAINT "authentication_methods_identityProvider_check" '
  );
  return knex.raw(
    'ALTER TABLE "authentication-methods" ADD CONSTRAINT "authentication_methods_identityProvider_check" CHECK ( "identityProvider" IN (\'PIX\', \'GAR\', \'POLE_EMPLOI\') )'
  );
};
