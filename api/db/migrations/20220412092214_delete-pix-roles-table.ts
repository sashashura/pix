const TABLE_NAME_TO_DELETE = 'pix_roles';
const TABLE_NAME_TO_UPDATE = 'pix-admin-roles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_TO_... Remove this comment to see the full error message
const COLUMN_TO_DELETE = 'pix_role_id';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.dropTable(TABLE_NAME_TO_DELETE);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TABLE_NAME_TO_DELETE, (table: $TSFixMe) => {
    table.increments('id').primary();
    table.string('name').notNull();
  });

  const [pixRoleId] = await knex(TABLE_NAME_TO_DELETE).insert({ name: 'PIX_MASTER' }).returning('id');

  await knex.schema.table(TABLE_NAME_TO_UPDATE, (table: $TSFixMe) => {
    table.bigInteger(COLUMN_TO_DELETE).defaultTo(pixRoleId).references(`${TABLE_NAME_TO_DELETE}.id`);
  });
};
