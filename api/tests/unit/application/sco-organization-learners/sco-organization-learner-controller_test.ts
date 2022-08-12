// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoOrganiz... Remove this comment to see the full error message
const scoOrganizationLearnerController = require('../../../../lib/application/sco-organization-learners/sco-organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoOrganiz... Remove this comment to see the full error message
const scoOrganizationLearnerSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/sco-organization-learner-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerUserAssociationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-learner-user-association-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerDependentUserSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-learner-dependent-user-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentInf... Remove this comment to see the full error message
const studentInformationForAccountRecoverySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | sco-organization-learner', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#reconcileScoOrganizationLearnerManually', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
      query: { withReconciliation: true },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'reconcileScoOrganizationLearnerManually');
      usecases.reconcileScoOrganizationLearnerManually.resolves();
      sinon.stub(scoOrganizationLearnerSerializer, 'serializeIdentity');
      scoOrganizationLearnerSerializer.serializeIdentity.resolves();
      sinon.stub(organizationLearnerUserAssociationSerializer, 'serialize');
      organizationLearnerUserAssociationSerializer.serialize.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations',
};
      const response = await scoOrganizationLearnerController.reconcileScoOrganizationLearnerManually(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/sco-organization-learners/association; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/association',
};
      const response = await scoOrganizationLearnerController.reconcileScoOrganizationLearnerManually(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#reconcileScoOrganizationLearnerAutomatically', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'reconcileScoOrganizationLearnerAutomatically');
      usecases.reconcileScoOrganizationLearnerAutomatically.resolves();
      sinon.stub(scoOrganizationLearnerSerializer, 'serializeIdentity');
      scoOrganizationLearnerSerializer.serializeIdentity.resolves();
      sinon.stub(organizationLearnerUserAssociationSerializer, 'serialize');
      organizationLearnerUserAssociationSerializer.serialize.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations/auto',
};
      const response = await scoOrganizationLearnerController.reconcileScoOrganizationLearnerAutomatically(
        request,
        hFake
      );

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/sco-organization-learners/association/auto; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/association/auto',
};
      const response = await scoOrganizationLearnerController.reconcileScoOrganizationLearnerAutomatically(
        request,
        hFake
      );

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateUsername', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'generateUsername');
      usecases.generateUsername.resolves();
      sinon.stub(scoOrganizationLearnerSerializer, 'serializeWithUsernameGeneration');
      scoOrganizationLearnerSerializer.serializeWithUsernameGeneration.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations/possibilities',
};
      const response = await scoOrganizationLearnerController.generateUsername(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/sco-organization-learners/possibilities; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/possibilities',
};
      const response = await scoOrganizationLearnerController.generateUsername(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAndReconcileUserToOrganizationLearner', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'createAndReconcileUserToOrganizationLearner');
      usecases.createAndReconcileUserToOrganizationLearner.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-dependent-users',
};
      const response = await scoOrganizationLearnerController.createAndReconcileUserToOrganizationLearner(
        request,
        hFake
      );

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/sco-organization-learners/dependent; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/dependent',
};
      const response = await scoOrganizationLearnerController.createAndReconcileUserToOrganizationLearner(
        request,
        hFake
      );

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUserAndReconcileToOrganizationLearnerFromExternalUser', function () {
    const userId = 2;
    let request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'createUserAndReconcileToOrganizationLearnerFromExternalUser');
      usecases.createUserAndReconcileToOrganizationLearnerFromExternalUser.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 response with an access token', async function () {
      // given
(hFake as $TSFixMe).request = { path: {} };
      // @ts-expect-error TS(2741): Property 'auth' is missing in type '{ payload: { d... Remove this comment to see the full error message
      request = {
        payload: {
          data: {
            attributes: {
              birthdate: '01-01-2000',
              'campaign-code': 'BADGES123',
              'external-user-token': '123SamlId',
            },
          },
        },
      };
      const token = Symbol('token');

      usecases.createUserAndReconcileToOrganizationLearnerFromExternalUser.resolves(token);

      // when
      const response =
        await scoOrganizationLearnerController.createUserAndReconcileToOrganizationLearnerFromExternalUser(
          request,
          hFake
        );

      // then
      expect(response.source.data.attributes['access-token']).to.deep.equal(token);
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-dependent-users/external-user-token',
};
      const response =
        await scoOrganizationLearnerController.createUserAndReconcileToOrganizationLearnerFromExternalUser(
          request,
          hFake
        );

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/sco-organization-learners/external; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/external',
};
      const response =
        await scoOrganizationLearnerController.createUserAndReconcileToOrganizationLearnerFromExternalUser(
          request,
          hFake
        );

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePassword', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'updateOrganizationLearnerDependentUserPassword');
      usecases.updateOrganizationLearnerDependentUserPassword.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-dependent-users/password-update',
};
      const response = await scoOrganizationLearnerController.updatePassword(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/sco-organization-learners/password-update; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/password-update',
};
      const response = await scoOrganizationLearnerController.updatePassword(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateUsernameWithTemporaryPassword', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'generateUsernameWithTemporaryPassword');
      usecases.generateUsernameWithTemporaryPassword.resolves();
      sinon.stub(organizationLearnerDependentUserSerializer, 'serialize');
      organizationLearnerDependentUserSerializer.serialize.resolves();
      usecases.generateUsernameWithTemporaryPassword.resolves();
      sinon.stub(scoOrganizationLearnerSerializer, 'serializeCredentialsForDependent');
      scoOrganizationLearnerSerializer.serializeCredentialsForDependent.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-dependent-users/generate-username-password',
};
      const response = await scoOrganizationLearnerController.generateUsernameWithTemporaryPassword(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/sco-organization-learners/username-password-generation; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/username-password-generation',
};
      const response = await scoOrganizationLearnerController.generateUsernameWithTemporaryPassword(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkScoAccountRecovery', function () {
    const userId = 2;
    let request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'checkScoAccountRecovery');
      usecases.checkScoAccountRecovery.resolves();
      sinon.stub(studentInformationForAccountRecoverySerializer, 'serialize');
      studentInformationForAccountRecoverySerializer.serialize.resolves();
      sinon.stub(studentInformationForAccountRecoverySerializer, 'deserialize');
      studentInformationForAccountRecoverySerializer.deserialize.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return student account information serialized', async function () {
      // given
(hFake as $TSFixMe).request = { path: {} };
      const studentInformation = {
        ineIna: '1234567890A',
        firstName: 'Bob',
        lastName: 'Camond',
        birthdate: '2001-12-08',
      };
      request = {
        payload: {
          data: {
            // @ts-expect-error TS(2322): Type '{ type: string; attributes: { 'ine-ina': str... Remove this comment to see the full error message
            type: 'student-information',
            attributes: {
              'ine-ina': studentInformation.ineIna,
              'first-name': studentInformation.firstName,
              'last-name': studentInformation.lastName,
              birthdate: studentInformation.birthdate,
            },
          },
        },
      };
      const studentInformationForAccountRecovery = Symbol();
      const studentInformationForAccountRecoveryJSONAPI = Symbol();

      studentInformationForAccountRecoverySerializer.deserialize.withArgs(request.payload).resolves(studentInformation);
      usecases.checkScoAccountRecovery.withArgs({ studentInformation }).resolves(studentInformationForAccountRecovery);
      studentInformationForAccountRecoverySerializer.serialize
        .withArgs(studentInformationForAccountRecovery)
        .returns(studentInformationForAccountRecoveryJSONAPI);

      // when
      const response = await scoOrganizationLearnerController.checkScoAccountRecovery(request, hFake);

      // then
      expect(response.source).to.deep.equal(studentInformationForAccountRecoveryJSONAPI);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-dependent-users/recover-account',
};
      const response = await scoOrganizationLearnerController.checkScoAccountRecovery(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/sco-organization-learners/account-recovery; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sco-organization-learners/account-recovery',
};
      const response = await scoOrganizationLearnerController.checkScoAccountRecovery(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });
});
