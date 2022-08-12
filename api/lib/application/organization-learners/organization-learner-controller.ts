// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerIdentitySerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-identity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerUserAssociationSerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-user-association-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async dissociate(request: $TSFixMe, h: $TSFixMe) {
    const organizationLearnerId = request.params.id;
    await usecases.dissociateUserFromOrganizationLearner({ organizationLearnerId });
    const response = h.response().code(204);
    if (h.request.path === `/api/schooling-registration-user-associations/${request.params.id}`) {
      response
        .header('Deprecation', 'true')
        .header('Link', `/api/organization-learners/${request.params.id}/association; rel="successor-version"`);
    }
    return response;
  },

  async findAssociation(request: $TSFixMe, h: $TSFixMe) {
    const authenticatedUserId = request.auth.credentials.userId;
    // eslint-disable-next-line no-restricted-syntax
    const requestedUserId = parseInt(request.query.userId);
    const campaignCode = request.query.campaignCode;

    const organizationLearner = await usecases.findAssociationBetweenUserAndOrganizationLearner({
      authenticatedUserId,
      requestedUserId,
      campaignCode,
    });

    if (h.request.path === `/api/schooling-registration-user-associations`) {
      return h
        .response(organizationLearnerUserAssociationSerializer.serialize(organizationLearner))
        .code(200)
        .header('Deprecation', 'true')
        .header('Link', `/api/organization-learners; rel="successor-version"`);
    }
    return h.response(organizationLearnerIdentitySerializer.serialize(organizationLearner)).code(200);
  },
};
