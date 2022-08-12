// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'sessions';
const OLD_STATUS = 'started';
const NEW_STATUS = 'created';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME).where('status', '=', OLD_STATUS).update({ status: NEW_STATUS });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex(TABLE_NAME).where('status', '=', NEW_STATUS).update({ status: OLD_STATUS });
};
