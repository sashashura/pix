// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'attributes... Remove this comment to see the full error message
const attributes = [
  'id',
  'firstName',
  'lastName',
  'birthdate',
  'extraTimePercentage',
  'authorizedToStart',
  'assessmentStatus',
];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(sessions: $TSFixMe) {
    return new Serializer('sessionForSupervising', {
      attributes: ['room', 'examiner', 'date', 'time', 'certificationCenterName', 'certificationCandidates'],
      typeForAttribute: (attribute: $TSFixMe) => attribute === 'certificationCandidates' ? 'certification-candidate-for-supervising' : attribute,
      certificationCandidates: {
        included: true,
        ref: 'id',
        attributes: [...attributes],
      },
    }).serialize(sessions);
  },
};
