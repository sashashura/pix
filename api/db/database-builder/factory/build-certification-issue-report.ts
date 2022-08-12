// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationIssueReportCategories } = require('../../../lib/domain/models/CertificationIssueReportCategory');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationIssueReport({
  id = databaseBuffer.getNextId(),
  certificationCourseId,
  category = CertificationIssueReportCategories.OTHER,
  description = 'Une super description',
  subcategory = null,
  hasBeenAutomaticallyResolved = null,
  questionNumber = null,
  resolvedAt = null,
  resolution = null
}: $TSFixMe = {}) {
  certificationCourseId = _.isUndefined(certificationCourseId) ? buildCertificationCourse().id : certificationCourseId;

  const values = {
    id,
    certificationCourseId,
    category,
    description,
    subcategory,
    questionNumber,
    hasBeenAutomaticallyResolved,
    resolvedAt,
    resolution,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-issue-reports',
    values,
  });
};
