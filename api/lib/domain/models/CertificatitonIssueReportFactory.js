const CertificationIssueReport = require('./CertificationIssueReport');

const ConnectionOrEndScreenCertificationIssueReport = require('./ConnectionOrEndScreenCertificationIssueReport');
const FraudCertificationIssueReport = require('./FraudCertificationIssueReport');
const { CertificationIssueReportCategories } = require('./CertificationIssueReportCategory');

module.exports = class CertificationIssueReportFactory {
  static create(certificationIssueReportDTO) {
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN) {
      return new ConnectionOrEndScreenCertificationIssueReport(certificationIssueReportDTO);
    }
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.FRAUD) {
      return new FraudCertificationIssueReport(certificationIssueReportDTO);
    }
    return CertificationIssueReport.new(certificationIssueReportDTO);
  }
};
