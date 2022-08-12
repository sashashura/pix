const ORGANIZATION_ROLES_TABLE = 'organization-roles';
const ORGANIZATIONS_ACCESSES_TABLE = 'organizations-accesses';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema
    .createTable(ORGANIZATION_ROLES_TABLE, (table: $TSFixMe) => {
      table.increments('id').primary();
      table.string('name');
    })
    .then(() => {
      return knex.schema.createTable(ORGANIZATIONS_ACCESSES_TABLE, (table: $TSFixMe) => {
        table.increments('id').primary();
        table.bigInteger('userId').references('users.id').index();
        table.bigInteger('organizationId').references('organizations.id').index();
      });
    })
    .then(() => {
      const roles = [{ name: 'ADMIN' }];

      return knex.batchInsert(ORGANIZATION_ROLES_TABLE, roles);
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(ORGANIZATIONS_ACCESSES_TABLE).then(() => {
    return knex.schema.dropTable(ORGANIZATION_ROLES_TABLE);
  });
};
