// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async reconcileSupOrganizationLearner(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;

    const campaignCode = payload['campaign-code'];

    const reconciliationInfo = {
      userId,
      studentNumber: payload['student-number'],
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    await usecases.reconcileSupOrganizationLearner({ campaignCode, reconciliationInfo });

    const response = h.response(null).code(204);
    if (h.request.path === '/api/schooling-registration-user-associations/student') {
      response
        .header('Deprecation', 'true')
        .header('Link', '/api/sup-organization-learners/association; rel="successor-version"');
    }
    return response;
  },

  async updateStudentNumber(request: $TSFixMe, h: $TSFixMe) {
    const payload = request.payload.data.attributes;
    const organizationId = request.params.id;
    const studentNumber = payload['student-number'];
    const organizationLearnerId = request.params.schoolingRegistrationId || request.params.organizationLearnerId;

    await usecases.updateStudentNumber({ organizationLearnerId, studentNumber, organizationId });

    const response = h.response().code(204);
    if (
      h.request.path ===
      `/api/organizations/${organizationId}/schooling-registration-user-associations/${organizationLearnerId}`
    ) {
      response
        .header('Deprecation', 'true')
        .header(
          'Link',
          `/api/organizations/${organizationId}/sup-organization-learners/${organizationLearnerId}; rel="successor-version"`
        );
    }
    return response;
  },
};
