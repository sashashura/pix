const {
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
} = require('./Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixEdu1erD... Remove this comment to see the full error message
class PixEdu1erDegreBadgeAcquisitionOrderer {
  badgesAcquisitions: $TSFixMe;
  constructor({
    badgesAcquisitions
  }: $TSFixMe = {}) {
    this.badgesAcquisitions = badgesAcquisitions;
  }

  getHighestBadge() {
    const expertFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: $TSFixMe) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT
    );
    const avanceFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: $TSFixMe) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE
    );
    const confirmeFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: $TSFixMe) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME
    );
    const confirmeFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: $TSFixMe) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME
    );
    const initieFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: $TSFixMe) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE
    );
    return (
      expertFormationContinueBadgeAcquisition ||
      avanceFormationContinueBadgeAcquisition ||
      confirmeFormationContinueBadgeAcquisition ||
      confirmeFormationInitialeBadgeAcquisition ||
      initieFormationInitialeBadgeAcquisition ||
      null
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixEdu1erDegreBadgeAcquisitionOrderer;
