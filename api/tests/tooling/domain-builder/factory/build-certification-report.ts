// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../../../lib/domain/models/CertificationReport');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCertificationIssueReport = require('./build-certification-issue-report');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationReport({
  id = 'CertificationReport:456',
  firstName = 'Tiffany',
  lastName = 'Schwarzenegger',
  hasSeenEndTestScreen = false,
  examinerComment,
  isCompleted,
  certificationIssueReports,
  certificationCourseId = 456,
  abortReason = null
}: $TSFixMe = {}) {
  return new CertificationReport({
    id,
    certificationCourseId,
    firstName,
    lastName,
    hasSeenEndTestScreen,
    examinerComment,
    isCompleted,
    certificationIssueReports: certificationIssueReports
      ? certificationIssueReports
      : [buildCertificationIssueReport({ certificationCourseId })],
    abortReason,
  });
};
