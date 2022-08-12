// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationResult = require('../../domain/models/CertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId({
    sessionId
  }: $TSFixMe) {
    const certificationResultDTOs = await _selectCertificationResults()
      .where('certification-courses.sessionId', sessionId)
      .orderBy('certification-courses.lastName', 'ASC')
      .orderBy('certification-courses.firstName', 'ASC');

    const complementaryCertificationCourseResultsByCertificationCourseId =
      await _selectComplementaryCertificationCourseResultsBySessionId({
        sessionId,
      });

    return certificationResultDTOs.map((certificationResultDTO: $TSFixMe) => {
      certificationResultDTO.complementaryCertificationCourseResults =
        complementaryCertificationCourseResultsByCertificationCourseId.find(
          ({
            certificationCourseId
          }: $TSFixMe) => certificationCourseId === certificationResultDTO.id
        )?.complementaryCertificationCourseResults;
      return _toDomain(certificationResultDTO);
    });
  },

  async findByCertificationCandidateIds({
    certificationCandidateIds
  }: $TSFixMe) {
    const certificationResultDTOs = await _selectCertificationResults()
      .join('certification-candidates', function(this: $TSFixMe) {
        this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
          'certification-candidates.userId': 'certification-courses.userId',
        });
      })
      .whereIn('certification-candidates.id', certificationCandidateIds)
      .orderBy('certification-courses.lastName', 'ASC')
      .orderBy('certification-courses.firstName', 'ASC');

    let complementaryCertificationCourseResultsByCertificationCourseId: $TSFixMe = [];
    if (!isEmpty(certificationResultDTOs)) {
      complementaryCertificationCourseResultsByCertificationCourseId =
        await _selectComplementaryCertificationCourseResultsBySessionId({
          sessionId: certificationResultDTOs[0].sessionId,
        });
    }

    return certificationResultDTOs.map((certificationResultDTO: $TSFixMe) => {
      certificationResultDTO.complementaryCertificationCourseResults =
        complementaryCertificationCourseResultsByCertificationCourseId.find(
          // @ts-expect-error TS(7031): Binding element 'certificationCourseId' implicitly... Remove this comment to see the full error message
          ({ certificationCourseId }) => certificationCourseId === certificationResultDTO.id
        )?.complementaryCertificationCourseResults;
      return _toDomain(certificationResultDTO);
    });
  },
};

function _selectCertificationResults() {
  return knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isCancelled: 'certification-courses.isCancelled',
      externalId: 'certification-courses.externalId',
      createdAt: 'certification-courses.createdAt',
      sessionId: 'certification-courses.sessionId',
      pixScore: 'assessment-results.pixScore',
      assessmentResultStatus: 'assessment-results.status',
      commentForOrganization: 'assessment-results.commentForOrganization',
      emitter: 'assessment-results.emitter',
    })
    .select(
      knex.raw(`
        json_agg("competence-marks".* ORDER BY "competence-marks"."competence_code" asc)  as "competenceMarks"`)
    )
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .modify(_filterMostRecentAssessmentResult)
    .leftJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .groupBy('certification-courses.id', 'assessments.id', 'assessment-results.id')
    .where('certification-courses.isPublished', true);
}

function _selectComplementaryCertificationCourseResultsBySessionId({
  sessionId
}: $TSFixMe) {
  return knex('complementary-certification-course-results')
    .select({ certificationCourseId: 'certification-courses.id' })
    .select(
      knex.raw(`
        json_agg("complementary-certification-course-results".*) as "complementaryCertificationCourseResults"`)
    )
    .join(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .join(
      'certification-courses',
      'certification-courses.id',
      'complementary-certification-courses.certificationCourseId'
    )
    .where({ sessionId })
    .groupBy('certification-courses.id');
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _filterMostRecentAssessmentResult(qb: $TSFixMe) {
  return qb.whereNotExists(
    knex
      .select(1)
      .from({ 'last-assessment-results': 'assessment-results' })
      .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
      .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationResultDTO: $TSFixMe) {
  return CertificationResult.from({
    certificationResultDTO,
  });
}
