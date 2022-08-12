// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'authentication-methods';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME, (t: $TSFixMe) => {
    t.increments('id').primary();
    t.integer('userId').references('users.id').index();
    t.string('identityProvider').notNullable();
    t.jsonb('authenticationComplement');
    t.string('externalIdentifier');
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());

    t.unique(['identityProvider', 'externalIdentifier']);
    t.unique(['identityProvider', 'userId']);
  });

  return knex.raw(
    'ALTER TABLE "authentication-methods" ADD CONSTRAINT "authentication_methods_identityProvider_check" CHECK ( "identityProvider" IN (\'PIX\', \'GAR\', \'POLE_EMPLOI\') )'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(TABLE_NAME);
};
