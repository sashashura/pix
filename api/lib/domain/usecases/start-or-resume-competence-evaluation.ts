// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('../models/CompetenceEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function startOrResumeCompetenceEvaluation({
  competenceId,
  userId,
  competenceEvaluationRepository,
  assessmentRepository,
  competenceRepository
}: $TSFixMe) {
  await _checkCompetenceExists(competenceId, competenceRepository);

  try {
    return await _resumeCompetenceEvaluation({
      userId,
      competenceId,
      assessmentRepository,
      competenceEvaluationRepository,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return await _startCompetenceEvaluation({
        userId,
        competenceId,
        assessmentRepository,
        competenceEvaluationRepository,
      });
    } else {
      throw err;
    }
  }
};

function _checkCompetenceExists(competenceId: $TSFixMe, competenceRepository: $TSFixMe) {
  return competenceRepository.get({ id: competenceId });
}

async function _resumeCompetenceEvaluation({
  userId,
  competenceId,
  assessmentRepository,
  competenceEvaluationRepository
}: $TSFixMe) {
  const competenceEvaluation = await competenceEvaluationRepository.getByCompetenceIdAndUserId({
    competenceId,
    userId,
  });

  if (competenceEvaluation.status === CompetenceEvaluation.statuses.RESET) {
    return _restartCompetenceEvaluation({
      userId,
      competenceEvaluation,
      assessmentRepository,
      competenceEvaluationRepository,
    });
  }

  return { competenceEvaluation, created: false };
}

async function _startCompetenceEvaluation({
  userId,
  competenceId,
  assessmentRepository,
  competenceEvaluationRepository
}: $TSFixMe) {
  const assessment = await _createAssessment({ userId, competenceId, assessmentRepository });
  const competenceEvaluation = await _createCompetenceEvaluation(
    competenceId,
    assessment.id,
    userId,
    competenceEvaluationRepository
  );

  return { competenceEvaluation, created: true };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _createAssessment({
  userId,
  competenceId,
  assessmentRepository
}: $TSFixMe) {
  const assessment = Assessment.createForCompetenceEvaluation({ userId, competenceId });
  return assessmentRepository.save({ assessment });
}

function _createCompetenceEvaluation(competenceId: $TSFixMe, assessmentId: $TSFixMe, userId: $TSFixMe, competenceEvaluationRepository: $TSFixMe) {
  const competenceEvaluation = new CompetenceEvaluation({
    userId,
    assessmentId,
    competenceId,
    status: CompetenceEvaluation.statuses.STARTED,
  });
  return competenceEvaluationRepository.save({ competenceEvaluation });
}

async function _restartCompetenceEvaluation({
  userId,
  competenceEvaluation,
  assessmentRepository,
  competenceEvaluationRepository
}: $TSFixMe) {
  const assessment = await _createAssessment({
    userId,
    competenceId: competenceEvaluation.competenceId,
    assessmentRepository,
  });
  await competenceEvaluationRepository.updateAssessmentId({
    currentAssessmentId: competenceEvaluation.assessmentId,
    newAssessmentId: assessment.id,
  });
  await competenceEvaluationRepository.updateStatusByUserIdAndCompetenceId({
    userId,
    competenceId: competenceEvaluation.competenceId,
    status: CompetenceEvaluation.statuses.STARTED,
  });
  const updatedCompetenceEvaluation = await competenceEvaluationRepository.getByCompetenceIdAndUserId({
    userId,
    competenceId: competenceEvaluation.competenceId,
  });

  return { competenceEvaluation: updatedCompetenceEvaluation, created: false };
}
