// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'badges';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'imageUrl';
const OVH_URL = 'https://storage.gra.cloud.ovh.net/v1/AUTH_27c5a6d3d35841a5914c7fb9a8e96345/pix-images';
const PIX_URL = 'https://images.pix.fr';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `UPDATE ${TABLE_NAME} SET "${COLUMN_NAME}" = REPLACE("${COLUMN_NAME}", '${OVH_URL}', '${PIX_URL}') WHERE "${COLUMN_NAME}" LIKE '${OVH_URL}%';`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};
