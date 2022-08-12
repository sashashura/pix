// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('./AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [AssessmentCompleted];
const EMITTER = 'PIX-ALGO';

async function handleCertificationScoring({
  event,
  assessmentResultRepository,
  badgeAcquisitionRepository,
  certificationAssessmentRepository,
  certificationCourseRepository,
  competenceMarkRepository,
  scoringCertificationService
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);

  if (event.isCertificationType) {
    const certificationAssessment = await certificationAssessmentRepository.get(event.assessmentId);
    return _calculateCertificationScore({
      certificationAssessment,
      assessmentResultRepository,
      certificationCourseRepository,
      competenceMarkRepository,
      scoringCertificationService,
      badgeAcquisitionRepository,
    });
  }

  return null;
}

async function _calculateCertificationScore({
  certificationAssessment,
  assessmentResultRepository,
  certificationCourseRepository,
  competenceMarkRepository,
  scoringCertificationService
}: $TSFixMe) {
  try {
    const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
      certificationAssessment,
      continueOnError: false,
    });
    await _saveResult({
      certificationAssessmentScore,
      certificationAssessment,
      assessmentResultRepository,
      certificationCourseRepository,
      competenceMarkRepository,
    });
    return new CertificationScoringCompleted({
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
      certificationCourseRepository,
      certificationComputeError: error,
    });
  }
}

async function _saveResult({
  certificationAssessment,
  certificationAssessmentScore,
  assessmentResultRepository,
  certificationCourseRepository,
  competenceMarkRepository
}: $TSFixMe) {
  const assessmentResult = await _createAssessmentResult({
    certificationAssessment,
    certificationAssessmentScore,
    assessmentResultRepository,
  });

  await bluebird.mapSeries(certificationAssessmentScore.competenceMarks, (competenceMark: $TSFixMe) => {
    const competenceMarkDomain = new CompetenceMark({
      ...competenceMark,
      ...{ assessmentResultId: assessmentResult.id },
    });
    return competenceMarkRepository.save(competenceMarkDomain);
  });
  const certificationCourse = await certificationCourseRepository.get(certificationAssessment.certificationCourseId);
  certificationCourse.complete({ now: new Date() });
  return certificationCourseRepository.update(certificationCourse);
}

function _createAssessmentResult({
  certificationAssessment,
  certificationAssessmentScore,
  assessmentResultRepository
}: $TSFixMe) {
  const assessmentResult = AssessmentResult.buildStandardAssessmentResult({
    pixScore: certificationAssessmentScore.nbPix,
    reproducibilityRate: certificationAssessmentScore.getPercentageCorrectAnswers(),
    status: certificationAssessmentScore.status,
    assessmentId: certificationAssessment.id,
    emitter: EMITTER,
  });
  return assessmentResultRepository.save(assessmentResult);
}

async function _saveResultAfterCertificationComputeError({
  certificationAssessment,
  assessmentResultRepository,
  certificationCourseRepository,
  certificationComputeError
}: $TSFixMe) {
  const assessmentResult = AssessmentResult.buildAlgoErrorResult({
    error: certificationComputeError,
    assessmentId: certificationAssessment.id,
    emitter: EMITTER,
  });
  await assessmentResultRepository.save(assessmentResult);
  const certificationCourse = await certificationCourseRepository.get(certificationAssessment.certificationCourseId);
  certificationCourse.complete({ now: new Date() });
  return certificationCourseRepository.update(certificationCourse);
}
// @ts-expect-error TS(2454): Variable 'handleCertificationScoring' is used befo... Remove this comment to see the full error message
handleCertificationScoring.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleCertificationScoring;
