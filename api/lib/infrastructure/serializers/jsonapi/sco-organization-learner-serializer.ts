// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeIdentity(scoOrganizationLearner: $TSFixMe) {
    return new Serializer('sco-organization-learner', {
      attributes: ['lastName', 'firstName', 'birthdate'],
    }).serialize(scoOrganizationLearner);
  },

  serializeWithUsernameGeneration(scoOrganizationLearner: $TSFixMe) {
    return new Serializer('sco-organization-learner', {
      attributes: ['lastName', 'firstName', 'birthdate', 'username'],
    }).serialize(scoOrganizationLearner);
  },

  serializeExternal(scoOrganizationLearner: $TSFixMe) {
    return new Serializer('external-users', {
      attributes: ['accessToken'],
    }).serialize(scoOrganizationLearner);
  },

  serializeCredentialsForDependent(scoOrganizationLearner: $TSFixMe) {
    return new Serializer('dependent-users', {
      attributes: ['username', 'generatedPassword'],
    }).serialize(scoOrganizationLearner);
  },
};
