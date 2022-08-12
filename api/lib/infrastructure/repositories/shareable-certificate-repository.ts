// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ShareableC... Remove this comment to see the full error message
const ShareableCertificate = require('../../domain/models/ShareableCertificate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('../../../lib/domain/models/CleaCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadgeImage = require('../../../lib/domain/read-models/CertifiedBadgeImage');
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
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceTreeRepository = require('./competence-tree-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetenceTree = require('../../domain/models/ResultCompetenceTree');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadges = require('../../domain/read-models/CertifiedBadges');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByVerificationCode(verificationCode: $TSFixMe, {
    locale
  }: $TSFixMe = {}) {
    const shareableCertificateDTO = await _selectShareableCertificates()
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .where({ verificationCode })
      .first();

    if (!shareableCertificateDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`There is no certification course with verification code "${verificationCode}"`);
    }

    const competenceTree = await competenceTreeRepository.get({ locale });

    const cleaCertificationResult = await _getCleaCertificationResult(shareableCertificateDTO.id);
    const certifiedBadgeImages = await _getCertifiedBadgeImages(shareableCertificateDTO.id);

    // @ts-expect-error TS(2554): Expected 1 arguments, but got 4.
    return _toDomain(shareableCertificateDTO, competenceTree, cleaCertificationResult, certifiedBadgeImages);
  },
};

function _selectShareableCertificates() {
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

function _filterMostRecentValidatedAssessmentResult(qb: $TSFixMe) {
  return qb
    .whereNotExists(
      knex
        .select(1)
        .from({ 'last-assessment-results': 'assessment-results' })
        .where('last-assessment-results.status', AssessmentResult.status.VALIDATED)
        .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
        .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
    )
    .where('assessment-results.status', AssessmentResult.status.VALIDATED);
}

async function _getCleaCertificationResult(certificationCourseId: $TSFixMe) {
  const result = await knex
    .select('acquired')
    .from('complementary-certification-course-results')
    .where({ certificationCourseId })
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId'
    )
    .whereIn('partnerKey', [PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3])
    .first();

  if (!result) {
    return CleaCertificationResult.buildNotTaken();
  }
  return CleaCertificationResult.buildFrom(result);
}

async function _getCertifiedBadgeImages(certificationCourseId: $TSFixMe) {
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
    .innerJoin('complementary-certification-badges', function(this: $TSFixMe) {
      this.on('complementary-certification-badges.badgeId', 'badges.id').on(
        'complementary-certification-badges.complementaryCertificationId',
        'complementary-certification-courses.complementaryCertificationId'
      );
    })
    .where({ certificationCourseId })
    .where(function(this: $TSFixMe) {
      this.whereIn('partnerKey', handledBadgeKeys);
    })
    .orderBy('partnerKey');

  const complementaryCertificationCourseResults = results.map(
    ({
      partnerKey,
      complementaryCertificationCourseId,
      acquired,
      source
    }: $TSFixMe) =>
      ComplementaryCertificationCourseResult.from({
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
    _.map(certifiedBadgesDTO, ({
      partnerKey,
      isTemporaryBadge
    }: $TSFixMe) => {
      const imageUrl = results.find((result: $TSFixMe) => result.partnerKey === partnerKey).imageUrl;

      return CertifiedBadgeImage.fromPartnerKey(partnerKey, isTemporaryBadge, imageUrl);
    })
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(shareableCertificateDTO: $TSFixMe, competenceTree: $TSFixMe, cleaCertificationResult: $TSFixMe, certifiedBadgeImages: $TSFixMe) {
  const resultCompetenceTree = ResultCompetenceTree.generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks: _.compact(shareableCertificateDTO.competenceMarks),
    certificationId: shareableCertificateDTO.id,
    assessmentResultId: shareableCertificateDTO.assessmentResultId,
  });

  return new ShareableCertificate({
    ...shareableCertificateDTO,
    resultCompetenceTree,
    cleaCertificationResult,
    certifiedBadgeImages,
  });
}
