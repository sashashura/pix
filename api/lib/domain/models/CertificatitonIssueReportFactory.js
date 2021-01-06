const CertificationIssueReport = require('./CertificationIssueReport');

module.exports = class CertificationIssueReportFactory {
  static build(certificationIssueReportDTO) {
    // TODO
    return CertificationIssueReport.new(certificationIssueReportDTO);
  }
};
