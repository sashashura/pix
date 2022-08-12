// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../../domain/models/CertificationReport');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationReports: $TSFixMe) {
    return new Serializer('certification-report', {
      attributes: [
        'certificationCourseId',
        'firstName',
        'lastName',
        'examinerComment',
        'hasSeenEndTestScreen',
        'certificationIssueReports',
        'isCompleted',
        'abortReason',
      ],
      certificationIssueReports: {
        ref: 'id',
        attributes: ['category', 'description', 'subcategory', 'questionNumber'],
      },
    }).serialize(certificationReports);
  },

  async deserialize(jsonApiData: $TSFixMe) {
    const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
    const deserializedReport = await deserializer.deserialize(jsonApiData);
    return new CertificationReport(deserializedReport);
  },
};
