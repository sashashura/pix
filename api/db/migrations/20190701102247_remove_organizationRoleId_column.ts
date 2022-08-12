// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'memberships';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const info = await knex(TABLE_NAME).columnInfo();
  if (info.organizationRoleId) {
    await knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
      table.dropColumn('organizationRoleId');
    });
  }

  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string('organizationRole').notNullable().defaultTo('MEMBER');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.alterTable(TABLE_NAME, (table: $TSFixMe) => {
    table.bigInteger('organizationRoleId').references('organization-roles.id').index();
    table.dropColumn('organizationRole');
  });

  await knex.raw('UPDATE ?? SET ?? = (SELECT id FROM ?? WHERE name = ?);', [
    TABLE_NAME,
    'organizationRoleId',
    'organization-roles',
    'ADMIN',
  ]);
};
