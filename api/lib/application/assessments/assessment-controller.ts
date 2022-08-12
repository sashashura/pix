// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentSerializer = require('../../infrastructure/serializers/jsonapi/assessment-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeS... Remove this comment to see the full error message
const challengeSerializer = require('../../infrastructure/serializers/jsonapi/challenge-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const competenceEvaluationSerializer = require('../../infrastructure/serializers/jsonapi/competence-evaluation-serializer');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
  extractLocaleFromRequest,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
  extractUserIdFromRequest,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe, h: $TSFixMe) {
    const assessment = assessmentSerializer.deserialize(request.payload);
    assessment.userId = extractUserIdFromRequest(request);
    assessment.state = 'started';
    const createdAssessment = await assessmentRepository.save({ assessment });
    return h.response(assessmentSerializer.serialize(createdAssessment)).created();
  },

  async get(request: $TSFixMe) {
    const assessmentId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const assessment = await usecases.getAssessment({ assessmentId, locale });

    return assessmentSerializer.serialize(assessment);
  },

  async getLastChallengeId(request: $TSFixMe, h: $TSFixMe) {
    const assessmentId = request.params.id;

    const lastChallengeId = await usecases.getLastChallengeIdFromAssessmentId({ assessmentId });

    return h.response(lastChallengeId).code(200);
  },

  async getChallengeForPixAutoAnswer(request: $TSFixMe, h: $TSFixMe) {
    const assessmentId = request.params.id;

    const challenge = await usecases.getChallengeForPixAutoAnswer({ assessmentId });

    return h.response(challenge).code(200);
  },

  async getNextChallenge(request: $TSFixMe) {
    const assessmentId = request.params.id;

    const logContext = {
      zone: 'assessmentController.getNextChallenge',
      type: 'controller',
      assessmentId,
    };
    logger.trace(logContext, 'tracing assessmentController.getNextChallenge()');

    try {
      const assessment = await assessmentRepository.get(assessmentId);
      (logContext as $TSFixMe).assessmentType = assessment.type;
      logger.trace(logContext, 'assessment loaded');

      const challenge = await _getChallenge(assessment, request);
      (logContext as $TSFixMe).challenge = challenge;
      logger.trace(logContext, 'replying with challenge');

      return challengeSerializer.serialize(challenge);
    } catch (error) {
      if (error instanceof AssessmentEndedError) {
        const object = new JSONAPISerializer('', {});
        return object.serialize(null);
      }
      throw error;
    }
  },

  async completeAssessment(request: $TSFixMe) {
    const assessmentId = request.params.id;

    let event;
    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      event = await usecases.completeAssessment({ assessmentId, domainTransaction });
    });

    await events.eventDispatcher.dispatch(event);

    return null;
  },

  async updateLastChallengeState(request: $TSFixMe) {
    const assessmentId = request.params.id;
    const lastQuestionState = request.params.state;
    const challengeId = request.payload?.data?.attributes?.['challenge-id'];

    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      await usecases.updateLastQuestionState({ assessmentId, challengeId, lastQuestionState, domainTransaction });
    });

    return null;
  },

  async findCompetenceEvaluations(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const assessmentId = request.params.id;

    const competenceEvaluations = await usecases.findCompetenceEvaluationsByAssessment({ userId, assessmentId });

    return competenceEvaluationSerializer.serialize(competenceEvaluations);
  },
};

async function _getChallenge(assessment: $TSFixMe, request: $TSFixMe) {
  if (assessment.isStarted()) {
    await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  }
  const challenge = await _getChallengeByAssessmentType({ assessment, request });

  if (challenge) {
    if (challenge.id !== assessment.lastChallengeId) {
      await assessmentRepository.updateWhenNewChallengeIsAsked({ id: assessment.id, lastChallengeId: challenge.id });
    }
  }

  return challenge;
}

async function _getChallengeByAssessmentType({
  assessment,
  request
}: $TSFixMe) {
  const locale = extractLocaleFromRequest(request);

  if (assessment.isPreview()) {
    return usecases.getNextChallengeForPreview({});
  }

  if (assessment.isCertification()) {
    return usecases.getNextChallengeForCertification({ assessment });
  }

  if (assessment.isDemo()) {
    return usecases.getNextChallengeForDemo({ assessment });
  }

  if (assessment.isForCampaign()) {
    return usecases.getNextChallengeForCampaignAssessment({ assessment, locale });
  }

  if (assessment.isCompetenceEvaluation()) {
    const userId = extractUserIdFromRequest(request);
    return usecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
  }

  return null;
}
