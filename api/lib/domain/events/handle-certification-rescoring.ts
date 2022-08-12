// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationResult = require('../models/CertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('./ChallengeNeutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('./ChallengeDeneutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationJuryDone = require('./CertificationJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [ChallengeNeutralized, ChallengeDeneutralized, CertificationJuryDone];

async function handleCertificationRescoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  competenceMarkRepository,
  scoringCertificationService,
  certificationCourseRepository
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);

  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId: event.certificationCourseId,
  });

  try {
    const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
      certificationAssessment,
      continueOnError: false,
    });

    const assessmentResultId = await _saveAssessmentResult(
      certificationAssessmentScore,
      certificationAssessment,
      event,
      assessmentResultRepository
    );

    await _saveCompetenceMarks(certificationAssessmentScore, assessmentResultId, competenceMarkRepository);

    await _cancelCertificationCourseIfHasNotEnoughNonNeutralizedChallengesToBeTrusted({
      certificationCourseId: certificationAssessment.certificationCourseId,
      hasEnoughNonNeutralizedChallengesToBeTrusted:
        certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted,
      certificationCourseRepository,
    });

    return new CertificationRescoringCompleted({
      userId: certificationAssessment.userId,
      certificationCourseId: certificationAssessment.certificationCourseId,
      reproducibilityRate: certificationAssessmentScore.percentageCorrectAnswers,
    });
  } catch (error) {
    if (!(error instanceof CertificationComputeError)) {
      throw error;
    }
    await _saveResultAfterCertificationComputeError({
      certificationAssessment,
      assessmentResultRepository,
      certificationComputeError: error,
      juryId: event.juryId,
      event,
    });
  }
}

async function _cancelCertificationCourseIfHasNotEnoughNonNeutralizedChallengesToBeTrusted({
  certificationCourseId,
  hasEnoughNonNeutralizedChallengesToBeTrusted,
  certificationCourseRepository
}: $TSFixMe) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  if (hasEnoughNonNeutralizedChallengesToBeTrusted) {
    certificationCourse.uncancel();
  } else {
    certificationCourse.cancel();
  }

  return certificationCourseRepository.update(certificationCourse);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _saveResultAfterCertificationComputeError({
  certificationAssessment,
  assessmentResultRepository,
  certificationComputeError,
  juryId,
  event
}: $TSFixMe) {
  const emitter = _getEmitterFromEvent(event);
  const assessmentResult = AssessmentResult.buildAlgoErrorResult({
    error: certificationComputeError,
    assessmentId: certificationAssessment.id,
    juryId,
    emitter,
  });
  await assessmentResultRepository.save(assessmentResult);
}

async function _saveAssessmentResult(
  certificationAssessmentScore: $TSFixMe,
  certificationAssessment: $TSFixMe,
  event: $TSFixMe,
  assessmentResultRepository: $TSFixMe
) {
  let assessmentResult;
  const emitter = _getEmitterFromEvent(event);
  if (!certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted) {
    assessmentResult = AssessmentResult.buildNotTrustableAssessmentResult({
      pixScore: certificationAssessmentScore.nbPix,
      reproducibilityRate: certificationAssessmentScore.getPercentageCorrectAnswers(),
      status: certificationAssessmentScore.status,
      assessmentId: certificationAssessment.id,
      emitter,
      juryId: event.juryId,
    });
  } else {
    assessmentResult = AssessmentResult.buildStandardAssessmentResult({
      pixScore: certificationAssessmentScore.nbPix,
      reproducibilityRate: certificationAssessmentScore.getPercentageCorrectAnswers(),
      status: certificationAssessmentScore.status,
      assessmentId: certificationAssessment.id,
      emitter,
      juryId: event.juryId,
    });
  }
  const { id: assessmentResultId } = await assessmentResultRepository.save(assessmentResult);
  return assessmentResultId;
}

async function _saveCompetenceMarks(certificationAssessmentScore: $TSFixMe, assessmentResultId: $TSFixMe, competenceMarkRepository: $TSFixMe) {
  await bluebird.mapSeries(certificationAssessmentScore.competenceMarks, (competenceMark: $TSFixMe) => {
    const competenceMarkDomain = new CompetenceMark({ ...competenceMark, assessmentResultId });
    return competenceMarkRepository.save(competenceMarkDomain);
  });
}

function _getEmitterFromEvent(event: $TSFixMe) {
  let emitter;

  if (event instanceof ChallengeNeutralized || event instanceof ChallengeDeneutralized) {
    emitter = CertificationResult.emitters.PIX_ALGO_NEUTRALIZATION;
  }

  if (event instanceof CertificationJuryDone) {
    emitter = CertificationResult.emitters.PIX_ALGO_AUTO_JURY;
  }

  return emitter;
}

// @ts-expect-error TS(2454): Variable 'handleCertificationRescoring' is used be... Remove this comment to see the full error message
handleCertificationRescoring.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleCertificationRescoring;
