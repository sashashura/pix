// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertification = require('../../domain/models/JuryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultsForJuryCertification = require('../../domain/read-models/ComplementaryCertificationCourseResultsForJuryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultsForJuryCertificationWithExternal = require('../../domain/read-models/ComplementaryCertificationCourseResultsForJuryCertificationWithExternal');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(certificationCourseId: $TSFixMe) {
    const juryCertificationDTO = await _selectJuryCertifications()
      .where('certification-courses.id', certificationCourseId)
      .first();

    if (!juryCertificationDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Certification course of id ${certificationCourseId} does not exist.`);
    }

    const competenceMarkDTOs = await knex('competence-marks')
      .where({
        assessmentResultId: juryCertificationDTO.assessmentResultId,
      })
      .orderBy('competence_code', 'asc');

    const complementaryCertificationCourseResultDTOs = await knex('complementary-certification-course-results')
      .leftJoin(
        'complementary-certification-courses',
        'complementary-certification-course-results.complementaryCertificationCourseId',
        'complementary-certification-courses.id'
      )
      .where({
        certificationCourseId: juryCertificationDTO.certificationCourseId,
      });

    const certificationIssueReportDTOs = await knex('certification-issue-reports')
      .where({ certificationCourseId })
      .orderBy('id', 'ASC');

    return _toDomainWithComplementaryCertifications({
      juryCertificationDTO,
      certificationIssueReportDTOs,
      competenceMarkDTOs,
      complementaryCertificationCourseResultDTOs,
    });
  },
};

function _selectJuryCertifications() {
  return knex
    .select({
      certificationCourseId: 'certification-courses.id',
      sessionId: 'certification-courses.sessionId',
      userId: 'certification-courses.userId',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      sex: 'certification-courses.sex',
      birthplace: 'certification-courses.birthplace',
      birthINSEECode: 'certification-courses.birthINSEECode',
      birthPostalCode: 'certification-courses.birthPostalCode',
      birthCountry: 'certification-courses.birthCountry',
      isCancelled: 'certification-courses.isCancelled',
      isPublished: 'certification-courses.isPublished',
      createdAt: 'certification-courses.createdAt',
      completedAt: 'certification-courses.completedAt',
      assessmentId: 'assessments.id',
      assessmentResultId: 'assessment-results.id',
      pixScore: 'assessment-results.pixScore',
      juryId: 'assessment-results.juryId',
      assessmentResultStatus: 'assessment-results.status',
      commentForCandidate: 'assessment-results.commentForCandidate',
      commentForOrganization: 'assessment-results.commentForOrganization',
      commentForJury: 'assessment-results.commentForJury',
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .modify(_filterMostRecentAssessmentResult)
    .groupBy('certification-courses.id', 'assessments.id', 'assessment-results.id');
}

function _filterMostRecentAssessmentResult(qb: $TSFixMe) {
  return qb.whereNotExists(
    knex
      .select(1)
      .from({ 'last-assessment-results': 'assessment-results' })
      .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
      .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
  );
}

async function _toDomainWithComplementaryCertifications({
  juryCertificationDTO,
  certificationIssueReportDTOs,
  competenceMarkDTOs,
  complementaryCertificationCourseResultDTOs
}: $TSFixMe) {
  const certificationIssueReports = certificationIssueReportDTOs.map(
    (certificationIssueReport: $TSFixMe) => new CertificationIssueReport({
      id: certificationIssueReport.id,
      certificationCourseId: certificationIssueReport.certificationCourseId,
      category: certificationIssueReport.category,
      description: certificationIssueReport.description,
      subcategory: certificationIssueReport.subcategory,
      questionNumber: certificationIssueReport.questionNumber,
      resolvedAt: certificationIssueReport.resolvedAt,
      resolution: certificationIssueReport.resolution,
      hasBeenAutomaticallyResolved: certificationIssueReport.hasBeenAutomaticallyResolved,
    })
  );

  const [complementaryCertificationCourseResultsWithExternal, commonComplementaryCertificationCourseResults] =
    _toComplementaryCertificationCourseResultForJuryCertification(complementaryCertificationCourseResultDTOs);

  return JuryCertification.from({
    juryCertificationDTO,
    certificationIssueReports,
    competenceMarkDTOs,
    complementaryCertificationCourseResultsWithExternal,
    commonComplementaryCertificationCourseResults,
  });
}

function _toComplementaryCertificationCourseResultForJuryCertification(complementaryCertificationCourseResults: $TSFixMe) {
  const [complementaryCertificationCourseResultsWithExternal, commonComplementaryCertificationCourseResults] =
    _.partition(complementaryCertificationCourseResults, (ccr: $TSFixMe) => {
      return ccr.partnerKey.startsWith('PIX_EDU');
    });

  const complementaryCertificationCourseResultsForJuryCertificationWithExternal =
    ComplementaryCertificationCourseResultsForJuryCertificationWithExternal.from(
      complementaryCertificationCourseResultsWithExternal
    );

  const commonComplementaryCertificationCourseResultsForJuryCertification =
    commonComplementaryCertificationCourseResults.map(
      ({
        id,
        partnerKey,
        acquired
      }: $TSFixMe) =>
        new ComplementaryCertificationCourseResultsForJuryCertification({ id, partnerKey, acquired })
    );

  return [
    complementaryCertificationCourseResultsForJuryCertificationWithExternal,
    commonComplementaryCertificationCourseResultsForJuryCertification,
  ];
}
