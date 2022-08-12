// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'knowledge-elements';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  const info = await knex(TABLE_NAME).columnInfo();
  if (!info.createdAt) {
    return knex.schema
      .table(TABLE_NAME, (table: $TSFixMe) => table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now()))
      .then(() =>
        knex.raw(
          'update "knowledge-elements" set "createdAt" = (select "createdAt" from answers where "knowledge-elements"."answerId" = answers.id);'
        )
      );
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('createdAt');
  });
};
