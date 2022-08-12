// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'complementary-certification-badges';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'imageUrl';
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.string(COLUMN_NAME);
  });

  const data = [
    { imageUrl: 'https://images.pix.fr/badges-certifies/pix-droit/maitre.svg', key: PIX_DROIT_MAITRE_CERTIF },
    { imageUrl: 'https://images.pix.fr/badges-certifies/pix-droit/expert.svg', key: PIX_DROIT_EXPERT_CERTIF },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-1-Initie-certif.svg',
      key: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
      key: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
      key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-3-Avance-certif.svg',
      key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-4-Expert-certif.svg',
      key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Autonome_PREMIER-DEGRE.svg',
      key: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
      key: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
      key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-avance_PREMIER-DEGRE.svg',
      key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Expert_PREMIER-DEGRE.svg',
      key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
      key: PIX_EMPLOI_CLEA_V1,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
      key: PIX_EMPLOI_CLEA_V2,
    },
    {
      imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
      key: PIX_EMPLOI_CLEA_V3,
    },
  ];

  await bluebird.mapSeries(data, addImageUrlForBadgeKey);

  await knex.schema.alterTable(TABLE_NAME, function (table: $TSFixMe) {
    table.string(COLUMN_NAME).notNullable().alter();
  });

  async function addImageUrlForBadgeKey({
    imageUrl,
    key
  }: $TSFixMe) {
    await knex(TABLE_NAME)
      .update({ imageUrl })
      .where({ badgeId: knex('badges').select('id').where({ key }) });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, function (table: $TSFixMe) {
    table.dropColumn(COLUMN_NAME);
  });
};
