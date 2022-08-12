// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_TABLE_... Remove this comment to see the full error message
const OLD_TABLE_NAME = 'users_pix_roles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_TABLE_... Remove this comment to see the full error message
const NEW_TABLE_NAME = 'pix-admin-roles';
const ROLE_COLUMN = 'role';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CREATED_AT... Remove this comment to see the full error message
const CREATED_AT_COLUMN = 'createdAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UPDATED_AT... Remove this comment to see the full error message
const UPDATED_AT_COLUMN = 'updatedAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DISABLED_A... Remove this comment to see the full error message
const DISABLED_AT_COLUMN = 'disabledAt';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_COLUMN... Remove this comment to see the full error message
const OLD_COLUMN_NAME = 'user_id';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_COLUMN... Remove this comment to see the full error message
const NEW_COLUMN_NAME = 'userId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_TO_... Remove this comment to see the full error message
const COLUMN_TO_DELETE = 'pix_role_id';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);
  await knex.schema.table(NEW_TABLE_NAME, (table: $TSFixMe) => {
    table.string(ROLE_COLUMN);
    table.dateTime(CREATED_AT_COLUMN).notNullable().defaultTo(knex.fn.now());
    table.dateTime(UPDATED_AT_COLUMN);
    table.dateTime(DISABLED_AT_COLUMN);
    table.renameColumn(OLD_COLUMN_NAME, NEW_COLUMN_NAME);
  });

  await knex(NEW_TABLE_NAME).update({
    [ROLE_COLUMN]: 'SUPER_ADMIN',
  });

  await knex.schema.alterTable(NEW_TABLE_NAME, function (table: $TSFixMe) {
    table.string(ROLE_COLUMN).notNullable().alter();
  });

  await knex.schema.table(NEW_TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_TO_DELETE);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);

  await knex.schema.table(OLD_TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(ROLE_COLUMN);
    table.dropColumn(CREATED_AT_COLUMN);
    table.dropColumn(UPDATED_AT_COLUMN);
    table.dropColumn(DISABLED_AT_COLUMN);
    table.renameColumn(NEW_COLUMN_NAME, OLD_COLUMN_NAME);
  });
};
