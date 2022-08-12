const TABLE = 'campaigns';
const ORGANIZATION_ID_COLUMN = 'organizationId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE ?? ALTER COLUMN ?? SET NOT NULL', [TABLE, ORGANIZATION_ID_COLUMN]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.raw('ALTER TABLE ?? ALTER COLUMN ?? DROP NOT NULL', [TABLE, ORGANIZATION_ID_COLUMN]);
};
