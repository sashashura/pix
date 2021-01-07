const CertificationIssueReport = require('./CertificationIssueReport');

const ConnectionOrEndScreenCertificationIssueReport = require('./ConnectionOrEndScreenCertificationIssueReport');
const FraudCertificationIssueReport = require('./FraudCertificationIssueReport');
const OtherCertificationIssueReport = require('./OtherCertificationIssueReport');
const LateOrLeavingCertificationIssueReport = require('./LateOrLeavingCertificationIssueReport');
const CandidateInformationChangesCertificationIssueReport = require('./CandidateInformationChangesCertificationIssueReport');
const { CertificationIssueReportCategories } = require('./CertificationIssueReportCategory');

module.exports = class CertificationIssueReportFactory {
  static create(certificationIssueReportDTO) {
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN) {
      return new ConnectionOrEndScreenCertificationIssueReport(certificationIssueReportDTO);
    }
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.FRAUD) {
      return new FraudCertificationIssueReport(certificationIssueReportDTO);
    }
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.OTHER) {
      return new OtherCertificationIssueReport(certificationIssueReportDTO);
    }
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.LATE_OR_LEAVING) {
      return new LateOrLeavingCertificationIssueReport(certificationIssueReportDTO);
    }
    if (certificationIssueReportDTO.category === CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES) {
      return new CandidateInformationChangesCertificationIssueReport(certificationIssueReportDTO);
    }
    return CertificationIssueReport.new(certificationIssueReportDTO);
  }
};
