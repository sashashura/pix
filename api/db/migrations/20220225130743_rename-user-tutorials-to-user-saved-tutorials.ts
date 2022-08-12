/* eslint-disable knex/avoid-injections */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OLD_TABLE_... Remove this comment to see the full error message
const OLD_TABLE_NAME = 'user_tutorials';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NEW_TABLE_... Remove this comment to see the full error message
const NEW_TABLE_NAME = 'user-saved-tutorials';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);
  await knex.raw(
    `ALTER TABLE "${NEW_TABLE_NAME}" RENAME CONSTRAINT "${OLD_TABLE_NAME}_pkey" TO "${NEW_TABLE_NAME}_pkey"`
  );
  await knex.raw(
    `ALTER TABLE "${NEW_TABLE_NAME}" RENAME CONSTRAINT "${OLD_TABLE_NAME}_userid_tutorialid_unique" TO "${NEW_TABLE_NAME}_userid_tutorialid_unique"`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);
  await knex.raw(
    `ALTER TABLE "${OLD_TABLE_NAME}" RENAME CONSTRAINT "${NEW_TABLE_NAME}_pkey" TO "${OLD_TABLE_NAME}_pkey"`
  );
  await knex.raw(
    `ALTER TABLE "${OLD_TABLE_NAME}" RENAME CONSTRAINT "${NEW_TABLE_NAME}_userid_tutorialid_unique" TO "${OLD_TABLE_NAME}_userid_tutorialid_unique"`
  );
};
/* eslint-enable knex/avoid-injections */
