// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ProgressionSerializer = require('../../infrastructure/serializers/jsonapi/progression-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;

    const progressionId = request.params.id;

    return usecases
      .getProgression({
        progressionId,
        userId,
      })
      .then(ProgressionSerializer.serialize);
  },
};
