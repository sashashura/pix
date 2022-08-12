// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
const PixPlusEduCertificationScoring = require('../models/PixPlusEduCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../models/ReproducibilityRate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerColl... Remove this comment to see the full error message
const AnswerCollectionForScoring = require('../models/AnswerCollectionForScoring');
const {
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
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
const { PIX_PLUS_EDU_2ND_DEGRE } = require('../models/ComplementaryCertification');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

function _isAllowedToBeScored(certifiableBadgeKey: $TSFixMe) {
  return [
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  ].includes(certifiableBadgeKey);
}

function _allowedToBeScoredBadgeKeys({
  certifiableBadgeKeys
}: $TSFixMe) {
  return certifiableBadgeKeys.filter(_isAllowedToBeScored);
}

async function handlePixPlusEdu2ndDegreCertificationsScoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  partnerCertificationScoringRepository,
  complementaryCertificationCourseRepository
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);
  const certificationCourseId = event.certificationCourseId;
  const complementaryCertificationCourseId =
    await complementaryCertificationCourseRepository.getComplementaryCertificationCourseId({
      certificationCourseId,
      complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
    });
  if (!complementaryCertificationCourseId) {
    return;
  }

  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  const certifiableBadgeKeys = certificationAssessment.listCertifiableBadgePixPlusKeysTaken();
  const allowedToBeScoredBadgeKeys = _allowedToBeScoredBadgeKeys({
    certifiableBadgeKeys,
  });

  for (const certifiableBadgeKey of allowedToBeScoredBadgeKeys) {
    const { certificationChallenges: pixPlusChallenges, certificationAnswers: pixPlusAnswers } =
      certificationAssessment.findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey);
    const assessmentResult = await assessmentResultRepository.getByCertificationCourseId({ certificationCourseId });
    const pixPlusEduCertificationScoring = _buildPixPlusEduCertificationScoring(
      complementaryCertificationCourseId,
      pixPlusChallenges,
      pixPlusAnswers,
      certifiableBadgeKey,
      assessmentResult
    );
    await partnerCertificationScoringRepository.save({ partnerCertificationScoring: pixPlusEduCertificationScoring });
  }
}

function _buildPixPlusEduCertificationScoring(
  complementaryCertificationCourseId: $TSFixMe,
  challenges: $TSFixMe,
  answers: $TSFixMe,
  certifiableBadgeKey: $TSFixMe,
  assessmentResult: $TSFixMe
) {
  const answerCollection = AnswerCollectionForScoring.from({ answers, challenges });
  const reproducibilityRate = ReproducibilityRate.from({
    numberOfNonNeutralizedChallenges: answerCollection.numberOfNonNeutralizedChallenges(),
    numberOfCorrectAnswers: answerCollection.numberOfCorrectAnswers(),
  });
  return new PixPlusEduCertificationScoring({
    complementaryCertificationCourseId,
    reproducibilityRate,
    certifiableBadgeKey,
    hasAcquiredPixCertification: assessmentResult.isValidated(),
  });
}

// @ts-expect-error TS(2454): Variable 'handlePixPlusEdu2ndDegreCertificationsSc... Remove this comment to see the full error message
handlePixPlusEdu2ndDegreCertificationsScoring.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handlePixPlusEdu2ndDegreCertificationsScoring;
