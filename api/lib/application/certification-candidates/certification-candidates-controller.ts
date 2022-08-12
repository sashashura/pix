// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateSubscriptionSerializer = require('../../infrastructure/serializers/jsonapi/certification-candidate-subscription-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async authorizeToStart(request: $TSFixMe, h: $TSFixMe) {
    const certificationCandidateForSupervisingId = request.params.id;

    const authorizedToStart = request.payload['authorized-to-start'];
    await usecases.authorizeCertificationCandidateToStart({
      certificationCandidateForSupervisingId,
      authorizedToStart,
    });

    return h.response().code(204);
  },

  async authorizeToResume(request: $TSFixMe, h: $TSFixMe) {
    const certificationCandidateId = request.params.id;

    await usecases.authorizeCertificationCandidateToResume({
      certificationCandidateId,
    });

    return h.response().code(204);
  },

  async getSubscriptions(request: $TSFixMe) {
    const certificationCandidateId = request.params.id;
    const certificationCandidateSubscription = await usecases.getCertificationCandidateSubscription({
      certificationCandidateId,
    });
    return certificationCandidateSubscriptionSerializer.serialize(certificationCandidateSubscription);
  },

  async endAssessmentBySupervisor(request: $TSFixMe) {
    const certificationCandidateId = request.params.id;

    await usecases.endAssessmentBySupervisor({ certificationCandidateId });

    return null;
  },
};
