const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const { AssessmentEndedError } = require('../../domain/errors');
const usecases = require('../../domain/usecases');
const events = require('../../domain/events');
const logger = require('../../infrastructure/logger');
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
const assessmentSerializer = require('../../infrastructure/serializers/jsonapi/assessment-serializer');
const challengeSerializer = require('../../infrastructure/serializers/jsonapi/challenge-serializer');
const questionSerializer = require('../../infrastructure/serializers/jsonapi/question-serializer');
const competenceEvaluationSerializer = require('../../infrastructure/serializers/jsonapi/competence-evaluation-serializer');
const { extractParameters } = require('../../infrastructure/utils/query-params-utils');
const { extractLocaleFromRequest, extractUserIdFromRequest } = require('../../infrastructure/utils/request-response-utils');

module.exports = {

  async save(request, h) {
    const assessment = assessmentSerializer.deserialize(request.payload);
    assessment.userId = extractUserIdFromRequest(request);
    assessment.state = 'started';
    const createdAssessment = await assessmentRepository.save({ assessment });
    return h.response(assessmentSerializer.serialize(createdAssessment)).created();
  },

  async get(request) {
    const assessmentId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const assessment = await usecases.getAssessment({ assessmentId, locale });

    return assessmentSerializer.serialize(assessment);
  },

  async getLastChallengeId(request, h) {
    const assessmentId = request.params.id;

    const lastChallengeId = await usecases.getLastChallengeIdFromAssessmentId({ assessmentId });

    return h.response(lastChallengeId).code(200);
  },

  async getChallengeForPixAutoAnswer(request, h) {
    const assessmentId = request.params.id;

    const challenge = await usecases.getChallengeForPixAutoAnswer({ assessmentId });

    return h.response(challenge).code(200);
  },

  async findByFilters(request) {
    let assessments = [];
    const userId = extractUserIdFromRequest(request);

    if (userId) {
      const filters = extractParameters(request.query).filter;

      if (filters.codeCampaign) {
        assessments = await usecases.findCampaignAssessments({ userId, filters });
      }
    }

    return assessmentSerializer.serialize(assessments);
  },

  async getNextChallenge(request) {
    const assessmentId = request.params.id;
    const locale = extractLocaleFromRequest(request);
    const userId = extractUserIdFromRequest(request);

    const logContext = {
      zone: 'assessmentController.getNextChallenge',
      type: 'controller',
      assessmentId,
    };
    logger.trace(logContext, 'tracing assessmentController.getNextChallenge()');

    const assessment = await assessmentRepository.get(assessmentId);
    logContext.assessmentType = assessment.type;
    logger.trace(logContext, 'assessment loaded');

    let usecase;
    let serializer;
    let extractChallengeId;

    if (assessment.isPreview()) {
      usecase = async () => usecases.getNextChallengeForPreview({});
      serializer = challengeSerializer;
      extractChallengeId = (challenge) => challenge.id;
    } else if (assessment.isCertification()) {
      usecase = async () => usecases.getNextChallengeForCertification({ assessment });
      serializer = questionSerializer;
      extractChallengeId = (question) => question.challenge.id;
    } else if (assessment.isDemo()) {
      usecase = async () => usecases.getNextChallengeForDemo({ assessment });
      serializer = challengeSerializer;
      extractChallengeId = (challenge) => challenge.id;
    } else if (assessment.isForCampaign()) {
      usecase = async () => usecases.getNextChallengeForCampaignAssessment({ assessment, locale });
      serializer = challengeSerializer;
      extractChallengeId = (challenge) => challenge.id;
    } else if (assessment.isCompetenceEvaluation()) {
      usecase = async () => usecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
      serializer = challengeSerializer;
      extractChallengeId = (challenge) => challenge.id;
    }

    try {
      const challengeOrQuestion = await _getNextChallengeOrQuestion({
        assessment,
        usecase,
        assessmentRepository,
        extractChallengeId,
      });

      logContext.challengeOrQuestion = challengeOrQuestion;
      logger.trace(logContext, 'replying with challenge or question');

      const responsePayload = serializer.serialize(challengeOrQuestion);
      return responsePayload;
    } catch (error) {
      if (error instanceof AssessmentEndedError) {
        const object = new JSONAPISerializer('', {});
        return object.serialize(null);
      }
      throw error;
    }
  },

  async completeAssessment(request) {
    const assessmentId = request.params.id;
    const event = await usecases.completeAssessment({ assessmentId });
    await events.eventDispatcher.dispatch(event);

    return null;
  },

  async findCompetenceEvaluations(request) {
    const userId = request.auth.credentials.userId;
    const assessmentId = request.params.id;

    const competenceEvaluations = await usecases.findCompetenceEvaluationsByAssessment({ userId, assessmentId });

    return competenceEvaluationSerializer.serialize(competenceEvaluations);
  },
};

async function _getNextChallengeOrQuestion({
  assessment,
  usecase,
  assessmentRepository,
  extractChallengeId,
}) {
  if (assessment.isStarted()) {
    await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  }

  const challengeOrQuestion = await usecase();

  if (challengeOrQuestion) {
    const challengeId = extractChallengeId(challengeOrQuestion);
    await assessmentRepository.updateLastChallengeIdAsked({ id: assessment.id, lastChallengeId: challengeId });
  }

  return challengeOrQuestion;
}
