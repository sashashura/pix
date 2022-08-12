// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerSeri... Remove this comment to see the full error message
const answerSerializer = require('../../infrastructure/serializers/jsonapi/answer-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'correction... Remove this comment to see the full error message
const correctionSerializer = require('../../infrastructure/serializers/jsonapi/correction-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe, h: $TSFixMe) {
    const answer = answerSerializer.deserialize(request.payload);
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const locale = requestResponseUtils.extractLocaleFromRequest(request);
    const createdAnswer = await usecases.correctAnswerThenUpdateAssessment({ answer, userId, locale });

    return h.response(answerSerializer.serialize(createdAnswer)).created();
  },

  async get(request: $TSFixMe) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const answerId = request.params.id;
    const answer = await usecases.getAnswer({ answerId, userId });

    return answerSerializer.serialize(answer);
  },

  async update(request: $TSFixMe) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const answerId = request.params.id;
    const answer = await usecases.getAnswer({ answerId, userId });

    return answerSerializer.serialize(answer);
  },

  async find(request: $TSFixMe) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const challengeId = request.query.challengeId;
    const assessmentId = request.query.assessmentId;
    let answers = [];
    if (challengeId && assessmentId) {
      answers = await usecases.findAnswerByChallengeAndAssessment({ challengeId, assessmentId, userId });
    }
    if (assessmentId && !challengeId) {
      answers = await usecases.findAnswerByAssessment({ assessmentId, userId });
    }

    return answerSerializer.serialize(answers);
  },

  async getCorrection(request: $TSFixMe) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const locale = requestResponseUtils.extractLocaleFromRequest(request);
    const answerId = request.params.id;

    const correction = await usecases.getCorrectionForAnswer({
      answerId,
      userId,
      locale,
    });

    return correctionSerializer.serialize(correction);
  },
};
