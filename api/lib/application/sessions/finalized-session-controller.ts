// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toBePublis... Remove this comment to see the full error message
const toBePublishedSessionSerializer = require('../../infrastructure/serializers/jsonapi/to-be-published-session-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'withRequir... Remove this comment to see the full error message
const withRequiredActionSessionSerializer = require('../../infrastructure/serializers/jsonapi/with-required-action-session-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findFinalizedSessionsToPublish() {
    const finalizedSessionsToPublish = await usecases.findFinalizedSessionsToPublish();
    return toBePublishedSessionSerializer.serialize(finalizedSessionsToPublish);
  },

  async findFinalizedSessionsWithRequiredAction() {
    const finalizedSessionsWithRequiredAction = await usecases.findFinalizedSessionsWithRequiredAction();
    return withRequiredActionSessionSerializer.serialize(finalizedSessionsWithRequiredAction);
  },
};
