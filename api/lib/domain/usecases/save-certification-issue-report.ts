// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../models/CertificationIssueReport');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function saveCertificationIssueReport({
  certificationIssueReportDTO,
  certificationIssueReportRepository
}: $TSFixMe) {
  const certificationIssueReport = CertificationIssueReport.create(certificationIssueReportDTO);
  return certificationIssueReportRepository.save(certificationIssueReport);
};
