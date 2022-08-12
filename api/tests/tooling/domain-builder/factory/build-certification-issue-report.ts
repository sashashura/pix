// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');

const buildCertificationIssueReport = function ({
  id = 123,
  certificationCourseId,
  category = CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES,
  subcategory = CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
  description = 'Une super description',
  questionNumber = null,
  hasBeenAutomaticallyResolved = null,
  resolvedAt = null,
  resolution = null
}: $TSFixMe = {}) {
  return new CertificationIssueReport({
    id,
    certificationCourseId,
    category,
    subcategory,
    description,
    questionNumber,
    hasBeenAutomaticallyResolved,
    resolvedAt,
    resolution,
  });
};

buildCertificationIssueReport.impactful = function ({
  id,
  certificationCourseId,
  description,
  questionNumber,
  resolvedAt,
  resolution,
  hasBeenAutomaticallyResolved
}: $TSFixMe = {}) {
  return buildCertificationIssueReport({
    id,
    certificationCourseId,
    description,
    questionNumber,
    resolvedAt,
    resolution,
    category: CertificationIssueReportCategories.FRAUD,
    subcategory: null,
    hasBeenAutomaticallyResolved,
  });
};

buildCertificationIssueReport.notImpactful = function ({
  id,
  certificationCourseId,
  description,
  questionNumber,
  resolvedAt,
  resolution,
  hasBeenAutomaticallyResolved
}: $TSFixMe = {}) {
  return buildCertificationIssueReport({
    id,
    certificationCourseId,
    description,
    questionNumber,
    resolvedAt,
    resolution,
    category: CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN,
    subcategory: null,
    hasBeenAutomaticallyResolved,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationIssueReport;
