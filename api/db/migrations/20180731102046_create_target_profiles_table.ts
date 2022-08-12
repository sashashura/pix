const TABLE_NAME_TARGET_PROFILES = 'target-profiles';
const TABLE_NAME_TARGET_PROFILES_SKILLS = 'target-profiles_skills';
const TABLE_NAME_CAMPAIGNS = 'campaigns';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema
    .createTable(TABLE_NAME_TARGET_PROFILES, (t: $TSFixMe) => {
      t.increments().primary();
      t.string('name').notNullable();
      t.boolean('isPublic').notNullable().defaultTo(false);
      t.integer('organizationId').unsigned().references('organizations.id').index();
      t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.schema.createTable(TABLE_NAME_TARGET_PROFILES_SKILLS, (t: $TSFixMe) => {
        t.increments().primary();
        t.integer('targetProfileId').unsigned().references('target-profiles.id').index();
        t.string('skillId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.table(TABLE_NAME_CAMPAIGNS, function (table: $TSFixMe) {
        table.integer('targetProfileId').references('target-profiles.id').index();
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema
    .table(TABLE_NAME_CAMPAIGNS, function (table: $TSFixMe) {
      table.dropColumn('targetProfileId');
    })
    .then(() => {
      return knex.schema.dropTable(TABLE_NAME_TARGET_PROFILES_SKILLS);
    })
    .then(() => {
      return knex.schema.dropTable(TABLE_NAME_TARGET_PROFILES);
    });
};
