// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAttestation = require('../../domain/models/CertificationAttestation');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/models/Badge').keys;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceTreeRepository = require('./competence-tree-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetenceTree = require('../../domain/models/ResultCompetenceTree');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadges = require('../../domain/read-models/CertifiedBadges');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const certificationCourseDTO = await _selectCertificationAttestations()
      .where('certification-courses.id', '=', id)
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .first();

    if (!certificationCourseDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`There is no certification course with id "${id}"`);
    }

    const competenceTree = await competenceTreeRepository.get();
    const acquiredComplementaryCertifications = await _getPartnerCertification(certificationCourseDTO.id);

    // @ts-expect-error TS(2554): Expected 1 arguments, but got 3.
    return _toDomain(certificationCourseDTO, competenceTree, acquiredComplementaryCertifications);
  },

  async findByDivisionForScoIsManagingStudentsOrganization({
    organizationId,
    division
  }: $TSFixMe) {
    const certificationCourseDTOs = await _selectCertificationAttestations()
      .select({ organizationLearnerId: 'organization-learners.id' })
      .innerJoin('certification-candidates', function(this: $TSFixMe) {
        this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
          'certification-candidates.userId': 'certification-courses.userId',
        });
      })
      .innerJoin('organization-learners', 'organization-learners.id', 'certification-candidates.organizationLearnerId')
      .innerJoin('organizations', 'organizations.id', 'organization-learners.organizationId')
      .where({
        'organization-learners.organizationId': organizationId,
        'organization-learners.isDisabled': false,
      })
      .whereRaw('LOWER("organization-learners"."division") = ?', division.toLowerCase())
      .whereRaw('"certification-candidates"."userId" = "certification-courses"."userId"')
      .whereRaw('"certification-candidates"."sessionId" = "certification-courses"."sessionId"')
      .modify(_checkOrganizationIsScoIsManagingStudents)
      .groupBy(
        'organization-learners.id',
        'certification-courses.id',
        'sessions.id',
        'assessments.id',
        'assessment-results.id'
      )
      .orderBy('certification-courses.createdAt', 'DESC');

    const competenceTree = await competenceTreeRepository.get();

    const mostRecentCertificationsPerOrganizationLearner =
      _filterMostRecentCertificationCoursePerOrganizationLearner(certificationCourseDTOs);
    return _(mostRecentCertificationsPerOrganizationLearner)
      .orderBy(['lastName', 'firstName'], ['asc', 'asc'])
      .map((certificationCourseDTO: $TSFixMe) => {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 3.
        return _toDomain(certificationCourseDTO, competenceTree, []);
      })
      .value();
  },
};

function _selectCertificationAttestations() {
  return knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isPublished: 'certification-courses.isPublished',
      userId: 'certification-courses.userId',
      date: 'certification-courses.createdAt',
      deliveredAt: 'sessions.publishedAt',
      verificationCode: 'certification-courses.verificationCode',
      certificationCenter: 'sessions.certificationCenter',
      maxReachableLevelOnCertificationDate: 'certification-courses.maxReachableLevelOnCertificationDate',
      pixScore: 'assessment-results.pixScore',
      assessmentResultId: 'assessment-results.id',
      competenceMarks: knex.raw(`
        json_agg(
          json_build_object('score', "competence-marks".score, 'level', "competence-marks".level, 'competence_code', "competence-marks"."competence_code")
          ORDER BY "competence-marks"."competence_code" asc
        )`),
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .join('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .join('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .join('sessions', 'sessions.id', 'certification-courses.sessionId')
    .modify(_filterMostRecentValidatedAssessmentResult)
    .where('certification-courses.isPublished', true)
    .where('certification-courses.isCancelled', false);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _filterMostRecentValidatedAssessmentResult(qb: $TSFixMe) {
  return qb
    .whereNotExists(
      knex
        .select(1)
        .from({ 'last-assessment-results': 'assessment-results' })
        .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
        .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
    )
    .where('assessment-results.status', AssessmentResult.status.VALIDATED);
}

function _checkOrganizationIsScoIsManagingStudents(qb: $TSFixMe) {
  return qb.where('organizations.type', 'SCO').where('organizations.isManagingStudents', true);
}

function _filterMostRecentCertificationCoursePerOrganizationLearner(DTOs: $TSFixMe) {
  const groupedByOrganizationLearner = _.groupBy(DTOs, 'organizationLearnerId');

  const mostRecent = [];
  for (const certificationsForOneOrganizationLearner of Object.values(groupedByOrganizationLearner)) {
    mostRecent.push((certificationsForOneOrganizationLearner as $TSFixMe)[0]);
  }
  return mostRecent;
}

async function _getPartnerCertification(certificationCourseId: $TSFixMe) {
  const handledBadgeKeys = [
    PIX_EMPLOI_CLEA_V1,
    PIX_EMPLOI_CLEA_V2,
    PIX_EMPLOI_CLEA_V3,
    PIX_DROIT_EXPERT_CERTIF,
    PIX_DROIT_MAITRE_CERTIF,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
    PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
    PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
  ];
  const complementaryCertificationCourseResults = await knex
    .select('complementary-certification-course-results.*')
    .from('complementary-certification-course-results')
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .where({ certificationCourseId })
    .where(function(this: $TSFixMe) {
      this.whereIn('partnerKey', handledBadgeKeys);
    });

  return complementaryCertificationCourseResults.map(ComplementaryCertificationCourseResult.from);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationCourseDTO: $TSFixMe, competenceTree: $TSFixMe, acquiredComplementaryCertifications: $TSFixMe) {
  const competenceMarks = _.compact(certificationCourseDTO.competenceMarks).map(
    (competenceMark: $TSFixMe) => new CompetenceMark({ ...competenceMark })
  );

  const resultCompetenceTree = ResultCompetenceTree.generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks,
    certificationId: certificationCourseDTO.id,
    assessmentResultId: certificationCourseDTO.assessmentResultId,
  });

  const certifiedBadgesDTO = new CertifiedBadges({
    complementaryCertificationCourseResults: acquiredComplementaryCertifications,
  }).getAcquiredCertifiedBadgesDTO();

  return new CertificationAttestation({
    ...certificationCourseDTO,
    resultCompetenceTree,
    certifiedBadges: certifiedBadgesDTO,
  });
}
