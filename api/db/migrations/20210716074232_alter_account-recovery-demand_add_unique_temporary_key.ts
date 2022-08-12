// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.raw(
    'ALTER TABLE "account-recovery-demands" ADD CONSTRAINT account_recovery_demands_temporary_key_unique UNIQUE("temporaryKey")'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw(
    'ALTER TABLE "account-recovery-demands" DROP CONSTRAINT account_recovery_demands_temporary_key_unique'
  );
};
