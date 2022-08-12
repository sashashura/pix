// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw('ALTER TABLE "account-recovery-demands" ALTER COLUMN "userId" SET NOT NULL');
  await knex.raw(
    'ALTER TABLE "account-recovery-demands" ADD CONSTRAINT "account_recovery_demands_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" (id)'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.raw('ALTER TABLE "account-recovery-demands" ALTER COLUMN "userId" DROP NOT NULL');
  await knex.raw('ALTER TABLE "account-recovery-demands" DROP CONSTRAINT "account_recovery_demands_userid_foreign"');
};
