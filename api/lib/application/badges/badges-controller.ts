// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeWithLearningContentSerializer = require('../../infrastructure/serializers/jsonapi/badge-with-learning-content-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeSeria... Remove this comment to see the full error message
const badgeSerializer = require('../../infrastructure/serializers/jsonapi/badge-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getBadge(request: $TSFixMe) {
    const badgeId = request.params.id;
    const badgeWithLearningContent = await usecases.getBadgeDetails({ badgeId });
    return badgeWithLearningContentSerializer.serialize(badgeWithLearningContent);
  },

  async updateBadge(request: $TSFixMe, h: $TSFixMe) {
    const badgeId = request.params.id;
    const badge = badgeSerializer.deserialize(request.payload);

    const updatedBadge = await usecases.updateBadge({ badgeId, badge });

    return h.response(badgeSerializer.serialize(updatedBadge)).code(204);
  },

  async deleteUnassociatedBadge(request: $TSFixMe, h: $TSFixMe) {
    const badgeId = request.params.id;
    await usecases.deleteUnassociatedBadge({ badgeId });

    return h.response().code(204);
  },
};
