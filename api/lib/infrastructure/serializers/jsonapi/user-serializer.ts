// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../domain/models/User');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(users: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('user', {
      transform(record: $TSFixMe) {
        record.profile = null;
        return record;
      },
      attributes: [
        'firstName',
        'lastName',
        'email',
        'username',
        'cgu',
        'lastTermsOfServiceValidatedAt',
        'mustValidateTermsOfService',
        'pixOrgaTermsOfServiceAccepted',
        'pixCertifTermsOfServiceAccepted',
        'lang',
        'isAnonymous',
        'memberships',
        'certificationCenterMemberships',
        'pixScore',
        'scorecards',
        'profile',
        'campaignParticipations',
        'hasSeenAssessmentInstructions',
        'isCertifiable',
        'hasSeenNewDashboardInfo',
        'hasSeenFocusedChallengeTooltip',
        'hasSeenOtherChallengesTooltip',
      ],
      memberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/memberships`;
          },
        },
      },
      certificationCenterMemberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/certification-center-memberships`;
          },
        },
      },
      pixScore: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/pixscore`;
          },
        },
      },
      scorecards: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/scorecards`;
          },
        },
      },
      profile: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/profile`;
          },
        },
      },
      campaignParticipations: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/campaign-participations`;
          },
        },
      },
      isCertifiable: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related: function (record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/users/${parent.id}/is-certifiable`;
          },
        },
      },
      meta,
    }).serialize(users);
  },

  deserialize(json: $TSFixMe) {
    return new User({
      id: json.data.id,
      firstName: json.data.attributes['first-name'],
      lastName: json.data.attributes['last-name'],
      email: json.data.attributes.email,
      cgu: json.data.attributes.cgu,
      lang: json.data.attributes.lang,
      lastTermsOfServiceValidatedAt: json.data.attributes['lastTermsOfServiceValidatedAt'],
      mustValidateTermsOfService: json.data.attributes['must-validate-terms-of-service'],
      pixOrgaTermsOfServiceAccepted: json.data.attributes['pix-orga-terms-of-service-accepted'],
      pixCertifTermsOfServiceAccepted: json.data.attributes['pix-certif-terms-of-service-accepted'],
    });
  },
};
