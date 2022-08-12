// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfCertifi... Remove this comment to see the full error message
const CpfCertificationResult = require('../../domain/read-models/CpfCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByTimeRange({
    startDate,
    endDate
  }: $TSFixMe) {
    const certificationCourses = await _selectCpfCertificationResults()
      .where('sessions.publishedAt', '>=', startDate)
      .where('sessions.publishedAt', '<=', endDate)
      .orderBy('certification-courses.id');

    return certificationCourses.map((certificationCourse: $TSFixMe) => new CpfCertificationResult(certificationCourse));
  },

  async findByIdRange({
    startId,
    endId
  }: $TSFixMe) {
    const certificationCourses = await _selectCpfCertificationResults()
      .whereBetween('certification-courses.id', [startId, endId])
      .orderBy(['sessions.publishedAt', 'certification-courses.lastName', 'certification-courses.firstName']);

    return certificationCourses.map((certificationCourse: $TSFixMe) => new CpfCertificationResult(certificationCourse));
  },
};

function _selectCpfCertificationResults() {
  return knex('certification-courses')
    .select('certification-courses.*', 'assessment-results.pixScore', 'sessions.publishedAt')
    .select(
      knex.raw(`
        json_agg(json_build_object(
          'competenceCode', "competence-marks"."competence_code",
          'level', "competence-marks"."level"
        ) ORDER BY "competence-marks"."competence_code" asc) as "competenceMarks"`)
    )
    .innerJoin('sessions', 'sessions.id', 'certification-courses.sessionId')
    .innerJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .innerJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .innerJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .whereNotExists(
      knex
        .select(1)
        .from({ 'last-assessment-results': 'assessment-results' })
        .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
        .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
    )
    .where('certification-courses.isPublished', true)
    .where('certification-courses.isCancelled', false)
    .where('assessment-results.status', AssessmentResult.status.VALIDATED)
    .groupBy('certification-courses.id', 'assessment-results.pixScore', 'sessions.publishedAt');
}
