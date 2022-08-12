// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TEMPLATE_T... Remove this comment to see the full error message
const TEMPLATE_TABLE_NAME = 'target-profile-templates';
const TEMPLATE_TUBES_TABLE_NAME = 'target-profile-templates_tubes';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
const TARGET_PROFILE_TABLE_NAME = 'target-profiles';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.createTable(TEMPLATE_TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
  });

  await knex.schema.createTable(TEMPLATE_TUBES_TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
    t.integer('targetProfileTemplateId').notNullable().references('target-profile-templates.id');
    t.string('tubeId').notNullable();
    t.integer('level').notNullable();
  });

  await knex.schema.table(TARGET_PROFILE_TABLE_NAME, (t: $TSFixMe) => {
    t.integer('targetProfileTemplateId').references('target-profile-templates.id');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TARGET_PROFILE_TABLE_NAME, (t: $TSFixMe) => {
    t.dropColumn('targetProfileTemplateId');
  });
  await knex.schema.dropTable(TEMPLATE_TUBES_TABLE_NAME);
  await knex.schema.dropTable(TEMPLATE_TABLE_NAME);
};
