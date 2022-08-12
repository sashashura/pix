// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'INDEX_NAME... Remove this comment to see the full error message
const INDEX_NAME = 'reset-password-demands_email_lower';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`CREATE INDEX "${INDEX_NAME}" ON "reset-password-demands"(LOWER("email"))`);
  return knex.schema.table('reset-password-demands', function (table: $TSFixMe) {
    table.dropIndex('email');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  await knex.schema.table('reset-password-demands', function (table: $TSFixMe) {
    table.index('email');
  });

  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(`DROP INDEX "${INDEX_NAME}"`);
};
