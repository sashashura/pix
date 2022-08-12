// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'schooling-registrations';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string('email');
    table.string('studentNumber');
    table.string('department');
    table.string('educationalTeam');
    table.string('group');
    table.string('diploma');
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn('email');
    table.dropColumn('studentNumber');
    table.dropColumn('department');
    table.dropColumn('educationalTeam');
    table.dropColumn('group');
    table.dropColumn('diploma');
  });
};
