const usecases = require('../../domain/usecases');
const scoOrganizationLearnerSerializer = require('../../infrastructure/serializers/jsonapi/sco-organization-learner-serializer');
const organizationLearnerUserAssociationSerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-user-association-serializer');
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');
const organizationLearnerDependentUserSerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-dependent-user-serializer');
const studentInformationForAccountRecoverySerializer = require('../../infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');

module.exports = {
  async reconcileScoOrganizationLearnerManually(request, h) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];
    const withReconciliation = request.query.withReconciliation === 'true';

    const reconciliationInfo = {
      id: authenticatedUserId,
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    const organizationLearner = await usecases.reconcileScoOrganizationLearnerManually({
      campaignCode,
      reconciliationInfo,
      withReconciliation,
    });

    let response;
    if (withReconciliation) {
      let serializedData;
      if (h.request.path === '/api/schooling-registration-user-associations') {
        serializedData = organizationLearnerUserAssociationSerializer.serialize(organizationLearner);
      } else {
        serializedData = scoOrganizationLearnerSerializer.serializeIdentity(organizationLearner);
      }
      response = h.response(serializedData).code(200);
    } else {
      response = h.response().code(204);
    }

    if (h.request.path === '/api/schooling-registration-user-associations') {
      response = response
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/association; rel="successor-version"');
    }
    return response;
  },

  async reconcileScoOrganizationLearnerAutomatically(request, h) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];
    const organizationLearner = await usecases.reconcileScoOrganizationLearnerAutomatically({
      userId: authenticatedUserId,
      campaignCode,
    });

    if (h.request.path === '/api/schooling-registration-user-associations/auto') {
      return h
        .response(organizationLearnerUserAssociationSerializer.serialize(organizationLearner))
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/association/auto; rel="successor-version"');
    }
    return h.response(scoOrganizationLearnerSerializer.serializeIdentity(organizationLearner));
  },

  async generateUsername(request, h) {
    const payload = request.payload.data.attributes;
    const { 'campaign-code': campaignCode } = payload;

    const studentInformation = {
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    const username = await usecases.generateUsername({ campaignCode, studentInformation });

    const scoOrganizationLearner = {
      ...studentInformation,
      username,
      campaignCode,
    };

    if (h.request.path === '/api/schooling-registration-user-associations/possibilities') {
      // we don't persist this ressource, we simulate response by adding the generated username
      const organizationLearnerWithUsernameResponse = {
        data: {
          attributes: {
            'last-name': payload['last-name'],
            'first-name': payload['first-name'],
            birthdate: payload['birthdate'],
            'campaign-code': campaignCode,
            username,
          },
          type: 'schooling-registration-user-associations',
        },
      };
      return h
        .response(organizationLearnerWithUsernameResponse)
        .code(200)
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/possibilities; rel="successor-version"');
    }
    return h
      .response(scoOrganizationLearnerSerializer.serializeWithUsernameGeneration(scoOrganizationLearner))
      .code(200);
  },

  async createAndReconcileUserToOrganizationLearner(request, h) {
    const payload = request.payload.data.attributes;
    const userAttributes = {
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
      email: payload.email,
      username: payload.username,
      withUsername: payload['with-username'],
    };
    const locale = extractLocaleFromRequest(request);

    await usecases.createAndReconcileUserToOrganizationLearner({
      userAttributes,
      password: payload.password,
      campaignCode: payload['campaign-code'],
      locale,
    });

    const response = h.response().code(204);
    if (h.request.path === '/api/schooling-registration-dependent-users') {
      return response
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/dependent; rel="successor-version"');
    }
    return response;
  },

  async createUserAndReconcileToOrganizationLearnerFromExternalUser(request, h) {
    const { birthdate, 'campaign-code': campaignCode, 'external-user-token': token } = request.payload.data.attributes;

    const accessToken = await usecases.createUserAndReconcileToOrganizationLearnerFromExternalUser({
      birthdate,
      campaignCode,
      token,
    });

    const scoOrganizationLearner = {
      accessToken,
    };

    const response = h.response(scoOrganizationLearnerSerializer.serializeExternal(scoOrganizationLearner)).code(200);
    if (h.request.path === '/api/schooling-registration-dependent-users/external-user-token') {
      return response
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/external; rel="successor-version"');
    }
    return response;
  },

  async updatePassword(request, h) {
    const payload = request.payload.data.attributes;
    const userId = request.auth.credentials.userId;
    const organizationId = payload['organization-id'];
    const organizationLearnerId = payload['schooling-registration-id'] || payload['organization-learner-id'];

    const generatedPassword = await usecases.updateOrganizationLearnerDependentUserPassword({
      userId,
      organizationId,
      organizationLearnerId,
    });

    if (h.request.path === '/api/schooling-registration-dependent-users/password-update') {
      const organizationLearnerWithGeneratedPasswordResponse = {
        data: {
          attributes: {
            'generated-password': generatedPassword,
          },
          type: 'schooling-registration-dependent-user',
        },
      };
      return h
        .response(organizationLearnerWithGeneratedPasswordResponse)
        .code(200)
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/password-update; rel="successor-version"');
    }

    const scoOrganizationLearner = {
      generatedPassword,
    };

    return h
      .response(scoOrganizationLearnerSerializer.serializeCredentialsForDependent(scoOrganizationLearner))
      .code(200);
  },

  async generateUsernameWithTemporaryPassword(request, h) {
    const payload = request.payload.data.attributes;
    const organizationId = payload['organization-id'];
    const organizationLearnerId = payload['schooling-registration-id'] || payload['organization-learner-id'];

    const result = await usecases.generateUsernameWithTemporaryPassword({
      organizationLearnerId,
      organizationId,
    });

    if (h.request.path === '/api/schooling-registration-dependent-users/generate-username-password') {
      const organizationLearnerWithGeneratedUsernamePasswordResponse =
        organizationLearnerDependentUserSerializer.serialize(result);
      return h
        .response(organizationLearnerWithGeneratedUsernamePasswordResponse)
        .code(200)
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/username-password-generation; rel="successor-version"');
    }

    return h.response(scoOrganizationLearnerSerializer.serializeCredentialsForDependent(result)).code(200);
  },

  async checkScoAccountRecovery(request, h) {
    const studentInformation = await studentInformationForAccountRecoverySerializer.deserialize(request.payload);

    const studentInformationForAccountRecovery = await usecases.checkScoAccountRecovery({
      studentInformation,
    });

    const response = h.response(
      studentInformationForAccountRecoverySerializer.serialize(studentInformationForAccountRecovery)
    );
    if (h.request.path === '/api/schooling-registration-dependent-users/recover-account') {
      return response
        .header('Deprecation', 'true')
        .header('Link', '/api/sco-organization-learners/account-recovery; rel="successor-version"');
    }

    return response;
  },
};
