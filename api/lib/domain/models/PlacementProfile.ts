// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY } = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
class PlacementProfile {
  profileDate: $TSFixMe;
  userCompetences: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    profileDate,
    userId,
    userCompetences
  }: $TSFixMe = {}) {
    this.profileDate = profileDate;
    this.userId = userId;
    this.userCompetences = userCompetences;
  }

  isCertifiable() {
    return this.getCertifiableCompetencesCount() >= MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY;
  }

  getCertifiableCompetencesCount() {
    return _(this.userCompetences)
      .filter((userCompetence: $TSFixMe) => userCompetence.isCertifiable())
      .size();
  }

  getCompetencesCount() {
    return this.userCompetences.length;
  }

  getPixScore() {
    return _.sumBy(this.userCompetences, 'pixScore');
  }

  getUserCompetence(competenceId: $TSFixMe) {
    return _.find(this.userCompetences, { id: competenceId }) || null;
  }

  getCertifiableUserCompetences() {
    return this.userCompetences.filter((uc: $TSFixMe) => uc.isCertifiable());
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PlacementProfile;
