// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'INDEX_NAME... Remove this comment to see the full error message
const INDEX_NAME = 'users_email_lower';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(`CREATE INDEX "${INDEX_NAME}" ON "users"(LOWER("email"))`);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(`DROP INDEX "${INDEX_NAME}"`);
};
