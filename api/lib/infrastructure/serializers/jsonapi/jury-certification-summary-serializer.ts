// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(juryCertificationSummary: $TSFixMe) {
    return new Serializer('jury-certification-summary', {
      transform(juryCertificationSummary: $TSFixMe) {
        const result = omit(juryCertificationSummary, 'certificationIssueReports');
        result.examinerComment = get(juryCertificationSummary, 'certificationIssueReports[0].description');
        result.numberOfCertificationIssueReports = juryCertificationSummary.certificationIssueReports.length;
        result.numberOfCertificationIssueReportsWithRequiredAction =
          juryCertificationSummary.certificationIssueReports.filter(
            (issueReport: $TSFixMe) => issueReport.isImpactful && issueReport.resolvedAt === null
          ).length;
        return result;
      },
      attributes: [
        'firstName',
        'lastName',
        'status',
        'pixScore',
        'createdAt',
        'completedAt',
        'isPublished',
        'examinerComment',
        'numberOfCertificationIssueReports',
        'numberOfCertificationIssueReportsWithRequiredAction',
        'hasSeenEndTestScreen',
        'isFlaggedAborted',
        'complementaryCertificationTakenLabels',
      ],
    }).serialize(juryCertificationSummary);
  },
};
