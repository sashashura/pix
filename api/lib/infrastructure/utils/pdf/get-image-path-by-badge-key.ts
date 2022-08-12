const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
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
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../domain/models/Badge').keys;

const STICKERS_PATH_BADGE_KEY = {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EMPLOI_CLEA_V1]: `${__dirname}/files/stickers/macaron_clea.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EMPLOI_CLEA_V2]: `${__dirname}/files/stickers/macaron_clea.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EMPLOI_CLEA_V3]: `${__dirname}/files/stickers/macaron_clea.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_DROIT_MAITRE_CERTIF]: `${__dirname}/files/stickers/macaron_droit_maitre.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_DROIT_EXPERT_CERTIF]: `${__dirname}/files/stickers/macaron_droit_expert.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]: `${__dirname}/files/stickers/macaron_edu_2nd_initie.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME]: `${__dirname}/files/stickers/macaron_edu_2nd_confirme.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME]: `${__dirname}/files/stickers/macaron_edu_2nd_confirme.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]: `${__dirname}/files/stickers/macaron_edu_2nd_avance.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]: `${__dirname}/files/stickers/macaron_edu_2nd_expert.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE]: `${__dirname}/files/stickers/macaron_edu_1er_initie.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME]: `${__dirname}/files/stickers/macaron_edu_1er_confirme.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME]: `${__dirname}/files/stickers/macaron_edu_1er_confirme.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE]: `${__dirname}/files/stickers/macaron_edu_1er_avance.pdf`,
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT]: `${__dirname}/files/stickers/macaron_edu_1er_expert.pdf`,
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getImagePathByBadgeKey(badgeKey: $TSFixMe) {
  return STICKERS_PATH_BADGE_KEY[badgeKey];
};
