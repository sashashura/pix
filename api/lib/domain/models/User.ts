// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const toLower = require('lodash/toLower');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('./AuthenticationMethod');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
class User {
  authenticationMethods: $TSFixMe;
  campaignParticipations: $TSFixMe;
  certificationCenterMemberships: $TSFixMe;
  cgu: $TSFixMe;
  email: $TSFixMe;
  emailConfirmedAt: $TSFixMe;
  firstName: $TSFixMe;
  hasSeenAssessmentInstructions: $TSFixMe;
  hasSeenFocusedChallengeTooltip: $TSFixMe;
  hasSeenNewDashboardInfo: $TSFixMe;
  hasSeenOtherChallengesTooltip: $TSFixMe;
  id: $TSFixMe;
  isAnonymous: $TSFixMe;
  knowledgeElements: $TSFixMe;
  lang: $TSFixMe;
  lastName: $TSFixMe;
  lastPixCertifTermsOfServiceValidatedAt: $TSFixMe;
  lastPixOrgaTermsOfServiceValidatedAt: $TSFixMe;
  lastTermsOfServiceValidatedAt: $TSFixMe;
  memberships: $TSFixMe;
  mustValidateTermsOfService: $TSFixMe;
  pixCertifTermsOfServiceAccepted: $TSFixMe;
  pixOrgaTermsOfServiceAccepted: $TSFixMe;
  pixScore: $TSFixMe;
  scorecards: $TSFixMe;
  username: $TSFixMe;
  constructor({
    id,
    cgu,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    email,
    emailConfirmedAt,
    username,
    firstName,
    knowledgeElements,
    lastName,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    hasSeenAssessmentInstructions,
    hasSeenNewDashboardInfo,
    hasSeenFocusedChallengeTooltip,
    hasSeenOtherChallengesTooltip,
    mustValidateTermsOfService,
    lang,
    isAnonymous,
    memberships = [],
    certificationCenterMemberships = [],
    pixScore,
    scorecards = [],
    campaignParticipations = [],
    authenticationMethods = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email ? toLower(email) : undefined;
    this.emailConfirmedAt = emailConfirmedAt;
    this.cgu = cgu;
    this.lastTermsOfServiceValidatedAt = lastTermsOfServiceValidatedAt;
    this.lastPixOrgaTermsOfServiceValidatedAt = lastPixOrgaTermsOfServiceValidatedAt;
    this.lastPixCertifTermsOfServiceValidatedAt = lastPixCertifTermsOfServiceValidatedAt;
    this.mustValidateTermsOfService = mustValidateTermsOfService;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.hasSeenAssessmentInstructions = hasSeenAssessmentInstructions;
    this.hasSeenOtherChallengesTooltip = hasSeenOtherChallengesTooltip;
    this.hasSeenNewDashboardInfo = hasSeenNewDashboardInfo;
    this.hasSeenFocusedChallengeTooltip = hasSeenFocusedChallengeTooltip;
    this.knowledgeElements = knowledgeElements;
    this.lang = lang;
    this.isAnonymous = isAnonymous;
    this.pixScore = pixScore;
    this.memberships = memberships;
    this.certificationCenterMemberships = certificationCenterMemberships;
    this.scorecards = scorecards;
    this.campaignParticipations = campaignParticipations;
    this.authenticationMethods = authenticationMethods;
  }

  get shouldChangePassword() {
    const pixAuthenticationMethod = this.authenticationMethods.find(
      (authenticationMethod: $TSFixMe) => authenticationMethod.identityProvider === AuthenticationMethod.identityProviders.PIX
    );

    return pixAuthenticationMethod ? pixAuthenticationMethod.authenticationComplement.shouldChangePassword : null;
  }

  isLinkedToOrganizations() {
    return this.memberships.length > 0;
  }

  isLinkedToCertificationCenters() {
    return this.certificationCenterMemberships.length > 0;
  }

  hasAccessToOrganization(organizationId: $TSFixMe) {
    return this.memberships.some((membership: $TSFixMe) => membership.organization.id === organizationId);
  }

  hasAccessToCertificationCenter(certificationCenterId: $TSFixMe) {
    return this.certificationCenterMemberships.some(
      (certificationCenterMembership: $TSFixMe) => certificationCenterMembership.certificationCenter.id === certificationCenterId &&
      isNil(certificationCenterMembership.disabledAt)
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = User;
