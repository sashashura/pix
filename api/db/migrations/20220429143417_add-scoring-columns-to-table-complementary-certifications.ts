// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table('complementary-certifications', (table: $TSFixMe) => {
    table.decimal('minimumReproducibilityRate', 5, 2).nullable();
    table.integer('minimumEarnedPix').nullable();
  });

  await knex('complementary-certifications')
    .update({
      minimumReproducibilityRate: 50.0,
      minimumEarnedPix: 70,
    })
    .where({ name: 'CléA Numérique' });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table('complementary-certifications', (table: $TSFixMe) => {
    table.dropColumn('minimumReproducibilityRate');
    table.dropColumn('minimumEarnedPix');
  });
};
