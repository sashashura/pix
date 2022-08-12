// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationSerializer = require('../../infrastructure/serializers/jsonapi/tutorial-evaluation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async evaluate(request: $TSFixMe, h: $TSFixMe) {
    const { userId } = request.auth.credentials;
    const { tutorialId } = request.params;
    const { status = TutorialEvaluation.statuses.LIKED } = tutorialEvaluationSerializer.deserialize(request.payload);

    const tutorialEvaluation = await usecases.addTutorialEvaluation({ userId, tutorialId, status });

    return h.response(tutorialEvaluationSerializer.serialize(tutorialEvaluation)).created();
  },
};
