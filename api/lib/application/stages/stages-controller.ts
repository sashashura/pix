// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stageSeria... Remove this comment to see the full error message
const stageSerializer = require('../../infrastructure/serializers/jsonapi/stage-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(request: $TSFixMe, h: $TSFixMe) {
    const stage = stageSerializer.deserialize(request.payload);
    const newStage = await usecases.createStage({ stage });
    return h.response(stageSerializer.serialize(newStage)).created();
  },

  async updateStage(request: $TSFixMe, h: $TSFixMe) {
    const stageId = request.params.id;
    const stage = stageSerializer.deserialize(request.payload);
    await usecases.updateStage({ ...stage, stageId });
    return h.response({}).code(204);
  },

  async getStageDetails(request: $TSFixMe) {
    const stageId = request.params.id;
    const stage = await usecases.getStageDetails({ stageId });
    return stageSerializer.serialize(stage);
  },
};
