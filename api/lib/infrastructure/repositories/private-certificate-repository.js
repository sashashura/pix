const _ = require('lodash');
const { knex } = require('../../../db/knex-database-connection');
const PrivateCertificate = require('../../domain/models/PrivateCertificate');
const CleaCertificationResult = require('../../../lib/domain/models/CleaCertificationResult');
const CertifiedBadgeImage = require('../../../lib/domain/read-models/CertifiedBadgeImage');
const CertifiedBadges = require('../../../lib/domain/read-models/CertifiedBadges');
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
const { NotFoundError } = require('../../../lib/domain/errors');
const competenceTreeRepository = require('./competence-tree-repository');
const ResultCompetenceTree = require('../../domain/models/ResultCompetenceTree');
const CompetenceMark = require('../../domain/models/CompetenceMark');
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');

module.exports = {
  async get(id, { locale } = {}) {
    const certificationCourseDTO = await _selectPrivateCertificates()
      .where('certification-courses.id', '=', id)
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .first();

    if (!certificationCourseDTO) {
      throw new NotFoundError(`Certificate not found for ID ${id}`);
    }

    const cleaCertificationResult = await _getCleaCertificationResult(id);
    const certifiedBadgeImages = await _getCertifiedBadgeImages(id);

    const competenceTree = await competenceTreeRepository.get({ locale });

    return _toDomain({
      certificationCourseDTO,
      competenceTree,
      cleaCertificationResult,
      certifiedBadgeImages,
    });
  },

  async findByUserId({ userId }) {
    const certificationCourseDTOs = await _selectPrivateCertificates()
      .where('certification-courses.userId', '=', userId)
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .orderBy('certification-courses.createdAt', 'DESC');

    const privateCertificates = [];
    for (const certificationCourseDTO of certificationCourseDTOs) {
      const cleaCertificationResult = await _getCleaCertificationResult(certificationCourseDTO.id);
      const certifiedBadgeImages = await _getCertifiedBadgeImages(certificationCourseDTO.id);
      const privateCertificate = _toDomain({
        certificationCourseDTO,
        cleaCertificationResult,
        certifiedBadgeImages,
      });
      privateCertificates.push(privateCertificate);
    }
    return privateCertificates;
  },
};

function _selectPrivateCertificates() {
  return knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isPublished: 'certification-courses.isPublished',
      isCancelled: 'certification-courses.isCancelled',
      userId: 'certification-courses.userId',
      date: 'certification-courses.createdAt',
      verificationCode: 'certification-courses.verificationCode',
      deliveredAt: 'sessions.publishedAt',
      certificationCenter: 'sessions.certificationCenter',
      maxReachableLevelOnCertificationDate: 'certification-courses.maxReachableLevelOnCertificationDate',
      pixScore: 'assessment-results.pixScore',
      commentForCandidate: 'assessment-results.commentForCandidate',
      assessmentResultStatus: 'assessment-results.status',
      assessmentResultId: 'assessment-results.id',
      competenceMarks: knex.raw(`
        json_agg(
          json_build_object('score', "competence-marks".score, 'level', "competence-marks".level, 'competence_code', "competence-marks"."competence_code")
          ORDER BY "competence-marks"."competence_code" asc
        )`),
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .modify(_filterMostRecentAssessmentResult)
    .leftJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .join('sessions', 'sessions.id', 'certification-courses.sessionId');
}

function _filterMostRecentAssessmentResult(qb) {
  return qb.whereNotExists(
    knex
      .select(1)
      .from({ 'last-assessment-results': 'assessment-results' })
      .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
      .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
  );
}

async function _getCleaCertificationResult(certificationCourseId) {
  const result = await knex
    .select('acquired')
    .from('complementary-certification-course-results')
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .where({ certificationCourseId })
    .whereIn('partnerKey', [PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3])
    .first();

  if (!result) {
    return CleaCertificationResult.buildNotTaken();
  }
  return CleaCertificationResult.buildFrom(result);
}

async function _getCertifiedBadgeImages(certificationCourseId) {
  const handledBadgeKeys = [
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
  const results = await knex
    .select('complementary-certification-course-results.*', 'complementary-certification-badges.imageUrl')
    .from('complementary-certification-course-results')
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .innerJoin('badges', 'badges.key', 'complementary-certification-course-results.partnerKey')
    .innerJoin('complementary-certification-badges', function () {
      this.on('complementary-certification-badges.badgeId', 'badges.id').on(
        'complementary-certification-badges.complementaryCertificationId',
        'complementary-certification-courses.complementaryCertificationId'
      );
    })
    .where({ certificationCourseId })
    .where(function () {
      this.whereIn('partnerKey', handledBadgeKeys);
    })
    .orderBy('partnerKey');

  const complementaryCertificationCourseResults = results.map(
    ({ partnerKey, complementaryCertificationCourseId, acquired, source }) =>
      ComplementaryCertificationCourseResult.from({
        certificationCourseId,
        complementaryCertificationCourseId,
        partnerKey,
        acquired,
        source,
      })
  );

  const certifiedBadgesDTO = new CertifiedBadges({
    complementaryCertificationCourseResults,
  }).getAcquiredCertifiedBadgesDTO();

  return _.compact(
    _.map(certifiedBadgesDTO, ({ partnerKey, isTemporaryBadge }) => {
      const imageUrl = results.find((result) => result.partnerKey === partnerKey).imageUrl;

      return CertifiedBadgeImage.fromPartnerKey(partnerKey, isTemporaryBadge, imageUrl);
    })
  );
}

function _toDomain({ certificationCourseDTO, competenceTree, cleaCertificationResult, certifiedBadgeImages }) {
  if (competenceTree) {
    const competenceMarks = _.compact(certificationCourseDTO.competenceMarks).map(
      (competenceMark) => new CompetenceMark({ ...competenceMark })
    );

    const resultCompetenceTree = ResultCompetenceTree.generateTreeFromCompetenceMarks({
      competenceTree,
      competenceMarks,
      certificationId: certificationCourseDTO.id,
      assessmentResultId: certificationCourseDTO.assessmentResultId,
    });

    return PrivateCertificate.buildFrom({
      ...certificationCourseDTO,
      resultCompetenceTree,
      cleaCertificationResult,
      certifiedBadgeImages,
    });
  }

  return PrivateCertificate.buildFrom({
    ...certificationCourseDTO,
    cleaCertificationResult,
    certifiedBadgeImages,
  });
}
