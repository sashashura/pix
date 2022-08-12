// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TEMPLATE_T... Remove this comment to see the full error message
const TEMPLATE_TABLE_NAME = 'target-profile-templates';
const OLD_TEMPLATE_TUBES_TABLE_NAME = 'target-profile-templates_tubes';
const TARGET_PROFILE_TUBES_TABLE_NAME = 'target-profile_tubes';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
const TARGET_PROFILE_TABLE_NAME = 'target-profiles';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TEMPLATE_TUBES_TABLE_NAME, TARGET_PROFILE_TUBES_TABLE_NAME);

  await knex.schema.table(TARGET_PROFILE_TUBES_TABLE_NAME, (t: $TSFixMe) => {
    t.integer('targetProfileId').references('target-profiles.id');
  });

  await knex(TARGET_PROFILE_TUBES_TABLE_NAME).update({
    targetProfileId: knex(TARGET_PROFILE_TABLE_NAME)
      .select('target-profiles.id')
      .where('target-profiles.targetProfileTemplateId', knex.ref('target-profile_tubes.targetProfileTemplateId')),
  });

  await knex.schema.table(TARGET_PROFILE_TUBES_TABLE_NAME, (t: $TSFixMe) => {
    t.dropNullable('targetProfileId');
    t.dropColumn('targetProfileTemplateId');
  });

  await knex.schema.table(TARGET_PROFILE_TABLE_NAME, (t: $TSFixMe) => {
    t.dropColumn('targetProfileTemplateId');
  });

  await knex.schema.dropTable(TEMPLATE_TABLE_NAME);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.createTable(TEMPLATE_TABLE_NAME, (t: $TSFixMe) => {
    t.increments().primary();
  });

  await knex.schema.table(TARGET_PROFILE_TABLE_NAME, (t: $TSFixMe) => {
    t.integer('targetProfileTemplateId').references('target-profile-templates.id');
  });

  await knex.schema.table(TARGET_PROFILE_TUBES_TABLE_NAME, (t: $TSFixMe) => {
    t.integer('targetProfileTemplateId').references('target-profile-templates.id');
  });

  const results = await knex(TARGET_PROFILE_TUBES_TABLE_NAME).distinct('targetProfileId');

  await bluebird.mapSeries(results, async ({
    targetProfileId
  }: $TSFixMe) => {
    const [{ id: targetProfileTemplateId }] = await knex(TEMPLATE_TABLE_NAME).insert({}).returning('id');

    await knex(TARGET_PROFILE_TABLE_NAME).update({ targetProfileTemplateId }).where({ id: targetProfileId });
    await knex(TARGET_PROFILE_TUBES_TABLE_NAME).update({ targetProfileTemplateId }).where({ targetProfileId });
  });

  await knex.schema.table(TARGET_PROFILE_TUBES_TABLE_NAME, (t: $TSFixMe) => {
    t.dropNullable('targetProfileTemplateId');
    t.dropColumn('targetProfileId');
  });

  await knex.schema.renameTable(TARGET_PROFILE_TUBES_TABLE_NAME, OLD_TEMPLATE_TUBES_TABLE_NAME);
};
