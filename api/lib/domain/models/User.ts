import toLower from 'lodash/toLower';
import isNil from 'lodash/isNil';

import AuthenticationMethod from './AuthenticationMethod';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email?: string | null;
  emailConfirmedAt: Date;
  cgu?: boolean;
  lastTermsOfServiceValidatedAt?: Date | null;
  lastPixOrgaTermsOfServiceValidatedAt?: Date | null;
  lastPixCertifTermsOfServiceValidatedAt?: Date | null;
  mustValidateTermsOfService: boolean;
  pixOrgaTermsOfServiceAccepted: boolean;
  pixCertifTermsOfServiceAccepted: boolean;
  hasSeenAssessmentInstructions: boolean;
  hasSeenOtherChallengesTooltip: boolean;
  hasSeenNewDashboardInfo: boolean;
  hasSeenFocusedChallengeTooltip: boolean;
  knowledgeElements: any;
  lang: string;
  isAnonymous: boolean;
  pixAdminRoles: any[];
  pixScore: number;
  memberships: any[];
  certificationCenterMemberships: any[];
  scorecards: any[];
  campaignParticipations: any[];
  authenticationMethods: any[];
  hasHairs: boolean;
}

export type UserInsertAttributes = IUser & {
  createdAt: Date;
  updatedAt: Date;
};

export class User implements IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string | undefined;
  emailConfirmedAt: Date;
  cgu: boolean | undefined;
  lastTermsOfServiceValidatedAt?: Date | null;
  lastPixOrgaTermsOfServiceValidatedAt?: Date | null;
  lastPixCertifTermsOfServiceValidatedAt?: Date | null;
  mustValidateTermsOfService: boolean;
  pixOrgaTermsOfServiceAccepted: boolean;
  pixCertifTermsOfServiceAccepted: boolean;
  hasSeenAssessmentInstructions: boolean;
  hasSeenOtherChallengesTooltip: boolean;
  hasSeenNewDashboardInfo: boolean;
  hasSeenFocusedChallengeTooltip: boolean;
  knowledgeElements: any;
  lang: string;
  isAnonymous: boolean;
  pixAdminRoles: any[];
  pixScore: number;
  memberships: any[];
  certificationCenterMemberships: any[];
  scorecards: any[];
  campaignParticipations: any[];
  authenticationMethods: any[];
  hasHairs = false;

  constructor(
    {
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
      pixAdminRoles = [],
      pixScore,
      scorecards = [],
      campaignParticipations = [],
      authenticationMethods = [],
      hasHairs,
    }: IUser = {} as unknown as IUser
  ) {
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
    this.pixAdminRoles = pixAdminRoles;
    this.pixScore = pixScore;
    this.memberships = memberships;
    this.certificationCenterMemberships = certificationCenterMemberships;
    this.scorecards = scorecards;
    this.campaignParticipations = campaignParticipations;
    this.authenticationMethods = authenticationMethods;
    this.hasHairs = hasHairs;
  }

  get hasAccessToAdminScope() {
    return this.pixAdminRoles.some((pixAdminRole) => pixAdminRole.hasAccessToAdminScope);
  }

  get shouldChangePassword() {
    const pixAuthenticationMethod = this.authenticationMethods.find(
      (authenticationMethod) => authenticationMethod.identityProvider === AuthenticationMethod.identityProviders.PIX
    );

    return pixAuthenticationMethod ? pixAuthenticationMethod.authenticationComplement.shouldChangePassword : null;
  }

  isLinkedToOrganizations() {
    return this.memberships.length > 0;
  }

  isLinkedToCertificationCenters() {
    return this.certificationCenterMemberships.length > 0;
  }

  hasAccessToOrganization(organizationId: any) {
    return this.memberships.some((membership) => membership.organization.id === organizationId);
  }

  hasAccessToCertificationCenter(certificationCenterId: any) {
    return this.certificationCenterMemberships.some(
      (certificationCenterMembership) =>
        certificationCenterMembership.certificationCenter.id === certificationCenterId &&
        isNil(certificationCenterMembership.disabledAt)
    );
  }
}
