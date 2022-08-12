// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.payload.data.attributes['user-id'];
    const certificationCenterId = request.payload.data.attributes['certification-center-id'];
    return usecases
      .createCertificationCenterMembership({ userId, certificationCenterId })
      .then((membership: $TSFixMe) => h.response(membership).created());
  },

  async disable(request: $TSFixMe, h: $TSFixMe) {
    const certificationCenterMembershipId = request.params.id;
    await usecases.disableCertificationCenterMembership({
      certificationCenterMembershipId,
    });
    return h.response().code(204);
  },
};
