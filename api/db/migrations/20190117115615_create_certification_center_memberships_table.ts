const CERTIFICATION_CENTER_MEMBERSHIPS = 'certification-center-memberships';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.createTable(CERTIFICATION_CENTER_MEMBERSHIPS, (t: $TSFixMe) => {
    t.increments('id').primary();
    t.bigInteger('userId').references('users.id').index();
    t.bigInteger('certificationCenterId').references('certification-centers.id').index();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.unique(['userId', 'certificationCenterId']);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.dropTable(CERTIFICATION_CENTER_MEMBERSHIPS);
};
