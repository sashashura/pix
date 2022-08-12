// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'target-profiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_IM... Remove this comment to see the full error message
const DEFAULT_IMAGE_URL = 'https://images.pix.fr/profil-cible/Illu_GEN.svg';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await updateWithDefaultImageUrl(knex);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};

async function updateWithDefaultImageUrl(knex: $TSFixMe) {
  await knex(TABLE_NAME).whereNull('imageUrl').update({
    imageUrl: DEFAULT_IMAGE_URL,
  });
}
