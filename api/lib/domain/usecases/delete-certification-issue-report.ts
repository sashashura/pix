// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteCertificationIssueReport({
  certificationIssueReportId,
  certificationCourseRepository,
  certificationIssueReportRepository,
  sessionRepository
}: $TSFixMe) {
  const certificationIssueReport = await certificationIssueReportRepository.get(certificationIssueReportId);
  const certificationCourse = await certificationCourseRepository.get(certificationIssueReport.certificationCourseId);
  const isFinalized = await sessionRepository.isFinalized(certificationCourse.getSessionId());

  if (isFinalized) {
    throw new ForbiddenAccess('Certification issue report deletion forbidden');
  }

  return certificationIssueReportRepository.delete(certificationIssueReportId);
};
