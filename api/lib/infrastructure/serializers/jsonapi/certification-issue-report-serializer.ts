// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationIssueReports: $TSFixMe) {
    return new Serializer('certification-issue-report', {
      attributes: ['category', 'description', 'subcategory', 'questionNumber'],
      transform: function (certificationIssueReport: $TSFixMe) {
        return Object.assign({}, certificationIssueReport);
      },
    }).serialize(certificationIssueReports);
  },

  deserialize(request: $TSFixMe) {
    const certificationCourseId = parseInt(request.params.id);
    const attributes = request.payload.data.attributes;

    return {
      certificationCourseId,
      category: attributes.category,
      description: attributes.description,
      subcategory: attributes.subcategory,
      questionNumber: attributes['question-number'],
    };
  },
};
