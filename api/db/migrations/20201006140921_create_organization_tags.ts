const TAGS_TABLE_NAME = 'tags';
const ORGANIZATION_TAGS_TABLE_NAME = 'organization-tags';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  await knex.schema.createTable(TAGS_TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.string('name').notNullable().unique();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });

  return knex.schema.createTable(ORGANIZATION_TAGS_TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.integer('organizationId').unsigned().references('organizations.id').index();
    t.integer('tagId').unsigned().references('tags.id').index();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    t.unique(['organizationId', 'tagId']);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  await knex.schema.dropTable(ORGANIZATION_TAGS_TABLE_NAME);
  return knex.schema.dropTable(TAGS_TABLE_NAME);
};
