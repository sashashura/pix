// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-candidates';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.text('billingMode').defaultsTo(null);
    table.text('prepaymentCode').defaultsTo(null);
  });

  await knex.raw(
    'ALTER TABLE "certification-candidates" ADD CONSTRAINT "certification-candidates_billingMode_check" CHECK ( "billingMode" IN ( \'FREE\', \'PAID\', \'PREPAID\'))'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('billingMode');
    table.dropColumn('prepaymentCode');
  });
};
