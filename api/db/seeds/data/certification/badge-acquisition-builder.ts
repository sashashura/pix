const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_BADGE_ID_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_BADGE_ID_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_BADGE_ID_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME_BADGE_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE_BADGE_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME_BADGE_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE_BADGE_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../badges-builder');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER1_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_SUC... Remove this comment to see the full error message
  CERTIF_SUCCESS_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_FAI... Remove this comment to see the full error message
  CERTIF_FAILURE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./users');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
function badgeAcquisitionBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_REGULAR_USER1_ID,
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V1,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_SUCCESS_USER_ID,
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V2,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_SUCCESS_USER_ID,
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V3,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_FAILURE_USER_ID,
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V3,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
    badgeId: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME_BADGE_ID,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
    badgeId: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE_BADGE_ID,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
    badgeId: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME_BADGE_ID,
  });
  databaseBuilder.factory.buildBadgeAcquisition({
    userId: CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
    badgeId: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE_BADGE_ID,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  badgeAcquisitionBuilder,
};
