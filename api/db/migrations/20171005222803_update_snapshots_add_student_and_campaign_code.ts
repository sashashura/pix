// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.schema.table('snapshots', (table: $TSFixMe) => {
    table.string('studentCode');
    table.string('campaignCode');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.schema.table('snapshots', (table: $TSFixMe) => {
    table.dropColumn('studentCode');
    table.dropColumn('campaignCode');
  });
};
