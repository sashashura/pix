// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationIssueReportCategories } = require('../../lib/domain/models/CertificationIssueReportCategory');
const CERTIFICATION_COURSES = 'certification-courses';
const CERTIFICATION_ISSUE_REPORTS = 'certification-issue-reports';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  const certificationCoursesWithExaminerComment = await knex(CERTIFICATION_COURSES)
    .select('id', 'examinerComment')
    .whereNotNull('examinerComment');

  const reportsToInsert = certificationCoursesWithExaminerComment.map(({
    id,
    examinerComment
  }: $TSFixMe) => {
    return {
      certificationCourseId: id,
      description: examinerComment,
      category: CertificationIssueReportCategories.OTHER,
    };
  });

  return knex.batchInsert(CERTIFICATION_ISSUE_REPORTS, reportsToInsert);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  const certificationCoursesWithExaminerComment = await knex(CERTIFICATION_COURSES)
    .select('id')
    .whereNotNull('examinerComment');

  const idsToDelete = certificationCoursesWithExaminerComment.map((c: $TSFixMe) => c.id);

  return knex(CERTIFICATION_ISSUE_REPORTS).whereIn('certificationCourseId', idsToDelete).delete();
};
