// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillSeria... Remove this comment to see the full error message
const skillSerializer = require('../../infrastructure/serializers/jsonapi/skill-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async listSkills(request: $TSFixMe) {
    const tubeId = request.params.id;

    const skills = await usecases.getTubeSkills({ tubeId });

    return skillSerializer.serialize(skills);
  },
};
