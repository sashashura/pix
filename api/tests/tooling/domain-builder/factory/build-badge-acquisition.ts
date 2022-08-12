// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildBadge = require('./build-badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeAcqui... Remove this comment to see the full error message
const BadgeAcquisition = require('../../../../lib/domain/models/BadgeAcquisition');
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
} = require('../../../../lib/domain/models/Badge').keys;

const buildBadgeAcquisition = function buildBadgeAcquisition({
  id = 123,
  userId = 456,
  badgeId = 789,
  campaignParticipationId = 159,
  badge
}: $TSFixMe = {}) {
  badge = badge || buildBadge({ id: badgeId });
  return new BadgeAcquisition({
    id,
    userId,
    badgeId,
    campaignParticipationId,
    badge,
  });
};

buildBadgeAcquisition.forPixEduFormationContinue2ndDegreExpert = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT }) });
};

buildBadgeAcquisition.forPixEduFormationContinue2ndDegreAvance = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE }) });
};

buildBadgeAcquisition.forPixEduFormationContinue2ndDegreConfirme = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME }) });
};

buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME }) });
};

buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreInitie = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE }) });
};

buildBadgeAcquisition.forPixEduFormationContinue1erDegreExpert = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT }) });
};

buildBadgeAcquisition.forPixEduFormationContinue1erDegreAvance = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE }) });
};

buildBadgeAcquisition.forPixEduFormationContinue1erDegreConfirme = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME }) });
};

buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME }) });
};

buildBadgeAcquisition.forPixEduFormationInitiale1erDegreInitie = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE }) });
};

buildBadgeAcquisition.forPixDroitMaitre = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_DROIT_MAITRE_CERTIF }) });
};

buildBadgeAcquisition.forPixDroitExpert = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_DROIT_EXPERT_CERTIF }) });
};

buildBadgeAcquisition.forCleaV1 = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EMPLOI_CLEA_V1 }) });
};

buildBadgeAcquisition.forCleaV2 = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EMPLOI_CLEA_V2 }) });
};

buildBadgeAcquisition.forCleaV3 = function () {
  return buildBadgeAcquisition({ badge: buildBadge({ key: PIX_EMPLOI_CLEA_V3 }) });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildBadgeAcquisition;
