// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationIssueReportAutomaticallyResolvedShouldNotBeUpdatedManually } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function manuallyResolveCertificationIssueReport({
  certificationIssueReportId,
  resolution,
  certificationIssueReportRepository
}: $TSFixMe) {
  const certificationIssueReport = await certificationIssueReportRepository.get(certificationIssueReportId);
  if (certificationIssueReport.hasBeenAutomaticallyResolved) {
    throw new CertificationIssueReportAutomaticallyResolvedShouldNotBeUpdatedManually();
  }

  certificationIssueReport.resolveManually(resolution);
  await certificationIssueReportRepository.save(certificationIssueReport);
};
