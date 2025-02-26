const { knex } = require('../../../db/knex-database-connection');
const CpfCertificationResult = require('../../domain/read-models/CpfCertificationResult');
const AssessmentResult = require('../../domain/models/AssessmentResult');

module.exports = {
  async findByTimeRange({ startDate, endDate }) {
    const certificationCourses = await _selectCpfCertificationResults()
      .where('sessions.publishedAt', '>=', startDate)
      .where('sessions.publishedAt', '<=', endDate)
      .orderBy('certification-courses.id');

    return certificationCourses.map((certificationCourse) => new CpfCertificationResult(certificationCourse));
  },

  async findByCertificationCourseIds({ certificationCourseIds }) {
    const certificationCourses = await _selectCpfCertificationResults()
      .whereIn('certification-courses.id', certificationCourseIds)
      .orderBy(['sessions.publishedAt', 'certification-courses.lastName', 'certification-courses.firstName']);

    return certificationCourses.map((certificationCourse) => new CpfCertificationResult(certificationCourse));
  },

  async markCertificationCoursesAsExported({ certificationCourseIds, filename }) {
    return knex('certification-courses').update({ cpfFilename: filename }).whereIn('id', certificationCourseIds);
  },
};

function _selectCpfCertificationResults() {
  return knex('certification-courses')
    .select('certification-courses.*', 'assessment-results.pixScore', 'sessions.publishedAt')
    .select(
      knex.raw(`
        json_agg(json_build_object(
          'competenceCode', "competence-marks"."competence_code",
          'areaCode', "competence-marks"."area_code",
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
    .whereNull('certification-courses.cpfFilename')
    .whereNotNull('certification-courses.sex')
    .where('assessment-results.status', AssessmentResult.status.VALIDATED)
    .where('competence-marks.level', '>', -1)
    .groupBy('certification-courses.id', 'assessment-results.pixScore', 'sessions.publishedAt');
}
