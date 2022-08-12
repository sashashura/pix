// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.createTable('complementary-certifications', (t: $TSFixMe) => {
    t.increments().primary();
    t.string('name').notNullable();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
  });

  const accreditations = await knex.from('accreditations');

  if (accreditations.length > 0) {
    await knex('complementary-certifications').insert(accreditations);

    const maxIdResult = await knex('complementary-certifications').max('id').first();
    const idForNextInsertion = maxIdResult.max + 1;
    // eslint-disable-next-line knex/avoid-injections
    await knex.raw(`ALTER SEQUENCE "complementary-certifications_id_seq" RESTART WITH ${idForNextInsertion}`);
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.dropTable('complementary-certifications');
};
