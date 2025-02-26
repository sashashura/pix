const _ = require('lodash');
const { knex } = require('../../../db/knex-database-connection');
const CertificationAttestation = require('../../domain/models/CertificationAttestation');
const {
  PIX_EMPLOI_CLEA_V1,
  PIX_EMPLOI_CLEA_V2,
  PIX_EMPLOI_CLEA_V3,
  PIX_DROIT_MAITRE_CERTIF,
  PIX_DROIT_EXPERT_CERTIF,
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
} = require('../../domain/models/Badge').keys;
const AssessmentResult = require('../../domain/models/AssessmentResult');
const { NotFoundError } = require('../../../lib/domain/errors');
const competenceTreeRepository = require('./competence-tree-repository');
const ResultCompetenceTree = require('../../domain/models/ResultCompetenceTree');
const CompetenceMark = require('../../domain/models/CompetenceMark');
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
const CertifiedBadges = require('../../domain/read-models/CertifiedBadges');

module.exports = {
  async get(id) {
    const certificationCourseDTO = await _selectCertificationAttestations()
      .where('certification-courses.id', '=', id)
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .first();

    if (!certificationCourseDTO) {
      throw new NotFoundError(`There is no certification course with id "${id}"`);
    }

    const competenceTree = await competenceTreeRepository.get();
    const acquiredComplementaryCertifications = await _getPartnerCertification(certificationCourseDTO.id);

    return _toDomain(certificationCourseDTO, competenceTree, acquiredComplementaryCertifications);
  },

  async findByDivisionForScoIsManagingStudentsOrganization({ organizationId, division }) {
    const certificationCourseDTOs = await _selectCertificationAttestations()
      .select({ organizationLearnerId: 'organization-learners.id' })
      .innerJoin('certification-candidates', function () {
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
      .map((certificationCourseDTO) => {
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

function _filterMostRecentValidatedAssessmentResult(qb) {
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

function _checkOrganizationIsScoIsManagingStudents(qb) {
  return qb.where('organizations.type', 'SCO').where('organizations.isManagingStudents', true);
}

function _filterMostRecentCertificationCoursePerOrganizationLearner(DTOs) {
  const groupedByOrganizationLearner = _.groupBy(DTOs, 'organizationLearnerId');

  const mostRecent = [];
  for (const certificationsForOneOrganizationLearner of Object.values(groupedByOrganizationLearner)) {
    mostRecent.push(certificationsForOneOrganizationLearner[0]);
  }
  return mostRecent;
}

async function _getPartnerCertification(certificationCourseId) {
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
    .select('complementary-certification-course-results.*', 'complementary-certification-badges.label')
    .from('complementary-certification-course-results')
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .innerJoin('badges', 'badges.key', 'complementary-certification-course-results.partnerKey')
    .innerJoin('complementary-certification-badges', 'complementary-certification-badges.badgeId', 'badges.id')
    .where({ certificationCourseId })
    .where(function () {
      this.whereIn('partnerKey', handledBadgeKeys);
    });

  return complementaryCertificationCourseResults.map(ComplementaryCertificationCourseResult.from);
}

function _toDomain(certificationCourseDTO, competenceTree, acquiredComplementaryCertifications) {
  const competenceMarks = _.compact(certificationCourseDTO.competenceMarks).map(
    (competenceMark) => new CompetenceMark({ ...competenceMark })
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
