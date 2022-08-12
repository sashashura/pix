// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'users';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  // SQLite does not support altering columns, so we do not try to alter
  // the column if it is already nullable, and we have modified the column
  // creation in the original migration to create it as nullable.

  const info = await knex(TABLE_NAME).columnInfo();
  if (!info.email.nullable) {
    return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
      table.string('email').nullable().alter();
    });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.string('email').notNullable().alter();
  });
};
