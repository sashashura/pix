// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scorecardS... Remove this comment to see the full error message
const scorecardSerializer = require('../../infrastructure/serializers/jsonapi/scorecard-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialSe... Remove this comment to see the full error message
const tutorialSerializer = require('../../infrastructure/serializers/jsonapi/tutorial-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getScorecard(request: $TSFixMe) {
    const locale = extractLocaleFromRequest(request);
    const authenticatedUserId = request.auth.credentials.userId;
    const scorecardId = request.params.id;

    return usecases.getScorecard({ authenticatedUserId, scorecardId, locale }).then(scorecardSerializer.serialize);
  },

  findTutorials(request: $TSFixMe) {
    const locale = extractLocaleFromRequest(request);
    const authenticatedUserId = request.auth.credentials.userId;
    const scorecardId = request.params.id;

    return usecases.findTutorials({ authenticatedUserId, scorecardId, locale }).then(tutorialSerializer.serialize);
  },
};
