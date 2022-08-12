// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const postgreSQLSequenceDefaultStart = 1;
const postgreSQLSequenceEnd = 2 ** 31 - 1;

const implementationType = {
  positiveInteger32bits: Joi.number()
    .integer()
    .min(postgreSQLSequenceDefaultStart)
    .max(postgreSQLSequenceEnd)
    .required(),
  alphanumeric255: Joi.string().max(255).required(),
  alphanumeric: Joi.string().required(),
};

const valuesToExport = {};

function _assignValueToExport(array: $TSFixMe, implementationType: $TSFixMe) {
  _.each(array, function (value: $TSFixMe) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    valuesToExport[value] = implementationType;
  });
}

const typesPositiveInteger32bits = [
  'adminMemberId',
  'answerId',
  'assessmentId',
  'authenticationMethodId',
  'badgeId',
  'badgeCriterionId',
  'campaignId',
  'campaignParticipationId',
  'certificationCandidateId',
  'certificationCenterId',
  'certificationCenterMembershipId',
  'certificationCourseId',
  'certificationIssueReportId',
  'complementaryCertificationCourseId',
  'membershipId',
  'organizationId',
  'organizationInvitationId',
  'ownerId',
  'schoolingRegistrationId',
  'organizationLearnerId',
  'sessionId',
  'stageId',
  'supervisorAccessesId',
  'targetProfileId',
  'targetProfileTemplateId',
  'userId',
  'userOrgaSettingsId',
];

const typesAlphanumeric = ['courseId', 'tutorialId'];
const typesAlphanumeric255 = ['challengeId', 'competenceId', 'frameworkId', 'tubeId'];

_assignValueToExport(typesPositiveInteger32bits, implementationType.positiveInteger32bits);
_assignValueToExport(typesAlphanumeric, implementationType.alphanumeric);
_assignValueToExport(typesAlphanumeric255, implementationType.alphanumeric255);

(valuesToExport as $TSFixMe).positiveInteger32bits = {
    min: postgreSQLSequenceDefaultStart,
    max: postgreSQLSequenceEnd,
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = valuesToExport;
