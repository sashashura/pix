// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
class UserToCreate {
  cgu: $TSFixMe;
  createdAt: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  hasSeenAssessmentInstructions: $TSFixMe;
  hasSeenFocusedChallengeTooltip: $TSFixMe;
  hasSeenNewDashboardInfo: $TSFixMe;
  hasSeenOtherChallengesTooltip: $TSFixMe;
  isAnonymous: $TSFixMe;
  lang: $TSFixMe;
  lastName: $TSFixMe;
  lastTermsOfServiceValidatedAt: $TSFixMe;
  mustValidateTermsOfService: $TSFixMe;
  updatedAt: $TSFixMe;
  username: $TSFixMe;
  constructor({
    firstName = '',
    lastName = '',
    email = null,
    cgu = false,
    hasSeenAssessmentInstructions = false,
    username = null,
    mustValidateTermsOfService = false,
    lastTermsOfServiceValidatedAt = null,
    lang = 'fr',
    hasSeenNewDashboardInfo = false,
    isAnonymous = false,
    hasSeenFocusedChallengeTooltip = false,
    hasSeenOtherChallengesTooltip = false,
    createdAt,
    updatedAt
  }: $TSFixMe = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.cgu = cgu;
    this.hasSeenAssessmentInstructions = hasSeenAssessmentInstructions;
    this.username = username;
    this.mustValidateTermsOfService = mustValidateTermsOfService;
    this.lastTermsOfServiceValidatedAt = lastTermsOfServiceValidatedAt;
    this.lang = lang;
    this.hasSeenNewDashboardInfo = hasSeenNewDashboardInfo;
    this.isAnonymous = isAnonymous;
    this.hasSeenFocusedChallengeTooltip = hasSeenFocusedChallengeTooltip;
    this.hasSeenOtherChallengesTooltip = hasSeenOtherChallengesTooltip;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(user: $TSFixMe) {
    const now = new Date();
    return new UserToCreate({
      ...user,
      createdAt: now,
      updatedAt: now,
      email: user.email ? _(user.email).toLower().trim() : null,
    });
  }

  static createWithTermsOfServiceAccepted(user: $TSFixMe) {
    const now = new Date();
    return new UserToCreate({
      ...user,
      cgu: true,
      lastTermsOfServiceValidatedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  static createAnonymous(user: $TSFixMe) {
    const now = new Date();
    return new UserToCreate({
      ...user,
      isAnonymous: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserToCreate;
