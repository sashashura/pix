// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeS... Remove this comment to see the full error message
const challengeSerializer = require('../../infrastructure/serializers/jsonapi/challenge-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: $TSFixMe) {
    return challengeRepository.get(request.params.id).then((challenge: $TSFixMe) => challengeSerializer.serialize(challenge));
  },
};
