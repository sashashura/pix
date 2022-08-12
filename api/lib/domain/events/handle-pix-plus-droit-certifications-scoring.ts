// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitCertificationScoring = require('../models/PixPlusDroitCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../models/ReproducibilityRate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerColl... Remove this comment to see the full error message
const AnswerCollectionForScoring = require('../models/AnswerCollectionForScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT } = require('../models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF } = require('../models/Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

// @ts-expect-error TS(2393): Duplicate function implementation.
function _isAllowedToBeScored(certifiableBadgeKey: $TSFixMe) {
  return [PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF].includes(certifiableBadgeKey);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _allowedToBeScoredBadgeKeys({
  certifiableBadgeKeys
}: $TSFixMe) {
  return certifiableBadgeKeys.filter(_isAllowedToBeScored);
}

async function handlePixPlusDroitCertificationsScoring({
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
      complementaryCertificationKey: PIX_PLUS_DROIT,
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
    const pixPlusDroitCertificationScoring = _buildPixPlusDroitCertificationScoring(
      complementaryCertificationCourseId,
      pixPlusChallenges,
      pixPlusAnswers,
      certifiableBadgeKey,
      assessmentResult
    );
    await partnerCertificationScoringRepository.save({ partnerCertificationScoring: pixPlusDroitCertificationScoring });
  }
}

function _buildPixPlusDroitCertificationScoring(
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

  return new PixPlusDroitCertificationScoring({
    complementaryCertificationCourseId,
    reproducibilityRate,
    certifiableBadgeKey,
    hasAcquiredPixCertification: assessmentResult.isValidated(),
  });
}

// @ts-expect-error TS(2454): Variable 'handlePixPlusDroitCertificationsScoring'... Remove this comment to see the full error message
handlePixPlusDroitCertificationsScoring.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handlePixPlusDroitCertificationsScoring;
