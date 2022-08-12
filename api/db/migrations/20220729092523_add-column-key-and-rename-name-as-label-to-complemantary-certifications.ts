// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'complementary-certifications';
const COLUMN_NAME_NAME = 'name';
const COLUMN_NAME_LABEL = 'label';
const COLUMN_NAME_KEY = 'key';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.string(COLUMN_NAME_KEY);
  });

  await knex(TABLE_NAME).where({ name: 'Pix+ Droit' }).update({ key: 'DROIT' });
  await knex(TABLE_NAME).where({ name: 'CléA Numérique' }).update({ key: 'CLEA' });
  await knex(TABLE_NAME).where({ name: 'Pix+ Édu 1er degré' }).update({ key: 'EDU_1ER_DEGRE' });
  await knex(TABLE_NAME).where({ name: 'Pix+ Édu 2nd degré' }).update({ key: 'EDU_2ND_DEGRE' });

  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.string(COLUMN_NAME_KEY).notNullable().alter();
    table.renameColumn(COLUMN_NAME_NAME, COLUMN_NAME_LABEL);
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME_KEY);
    table.renameColumn(COLUMN_NAME_LABEL, COLUMN_NAME_NAME);
  });
};
