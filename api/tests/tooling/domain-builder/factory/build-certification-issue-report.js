const CertificationIssueReport = require('../../../../lib/domain/models/certification-issue-report/CertificationIssueReport');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('../../../../lib/domain/models/certification-issue-report/CertificationIssueReportCategory');

module.exports = function buildCertificationIssueReport({
  id = 123,
  certificationCourseId,
  category = CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES,
  subcategory = CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
  description = 'Une super description',
  questionNumber = null,
} = {}) {
  return new CertificationIssueReport({
    id,
    certificationCourseId,
    category,
    subcategory,
    description,
    questionNumber,
  });
};
