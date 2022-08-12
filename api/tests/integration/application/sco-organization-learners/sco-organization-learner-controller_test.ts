// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/sco-organization-learners');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToUpdatePasswordError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToGenerateUsernamePasswordError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | sco-organization-learners | sco-organization-learner-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'createAndReconcileUserToOrganizationLearner').rejects(new Error('not expected error'));
    sandbox.stub(usecases, 'updateOrganizationLearnerDependentUserPassword').rejects(new Error('not expected error'));
    sandbox.stub(usecases, 'generateUsernameWithTemporaryPassword').rejects(new Error('not expected error'));
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToScoOrganizationAndManagesStudents');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAndReconcileUserToOrganizationLearner for api/schooling-registration-dependent-users', function () {
    const payload = { data: { attributes: {} } };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      payload.data.attributes = {
        'first-name': 'Robert',
        'last-name': 'Smith',
        birthdate: '2012-12-12',
        'campaign-code': 'RESTRICTD',
        password: 'P@ssw0rd',
        username: 'robert.smith1212',
        'with-username': true,
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is used', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an HTTP response with status code 204', async function () {
          // given
          const createdUser = domainBuilder.buildUser();
          (payload.data.attributes as $TSFixMe).email = 'toto@example.net';
          delete (payload.data.attributes as $TSFixMe).username;
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          payload.data.attributes['with-username'] = false;
          usecases.createAndReconcileUserToOrganizationLearner.resolves(createdUser);

          // when
          const response = await httpTestServer.request('POST', '/api/schooling-registration-dependent-users', payload);

          // then
          expect(response.statusCode).to.equal(204);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is used', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an HTTP response with status code 204', async function () {
          // given
          const createdUser = domainBuilder.buildUser();
          delete (payload.data.attributes as $TSFixMe).email;
          (payload.data.attributes as $TSFixMe).username = 'robert.smith1212';
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          payload.data.attributes['with-username'] = true;
          usecases.createAndReconcileUserToOrganizationLearner.resolves(createdUser);

          // when
          const response = await httpTestServer.request('POST', '/api/schooling-registration-dependent-users', payload);

          // then
          expect(response.statusCode).to.equal(204);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a NotFoundError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 404 HTTP response', async function () {
          // given
delete (payload.data.attributes as $TSFixMe).username;
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          usecases.createAndReconcileUserToOrganizationLearner.rejects(new NotFoundError());

          // when
          const response = await httpTestServer.request('POST', '/api/schooling-registration-dependent-users', payload);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAndReconcileUserToOrganizationLearner for api/sco-organization-learners/dependent', function () {
    const payload = { data: { attributes: {} } };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      payload.data.attributes = {
        'first-name': 'Robert',
        'last-name': 'Smith',
        birthdate: '2012-12-12',
        'campaign-code': 'RESTRICTD',
        password: 'P@ssw0rd',
        username: 'robert.smith1212',
        'with-username': true,
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When email is used', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an HTTP response with status code 204', async function () {
          // given
          const createdUser = domainBuilder.buildUser();
          (payload.data.attributes as $TSFixMe).email = 'toto@example.net';
          delete (payload.data.attributes as $TSFixMe).username;
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          payload.data.attributes['with-username'] = false;
          usecases.createAndReconcileUserToOrganizationLearner.resolves(createdUser);

          // when
          const response = await httpTestServer.request('POST', '/api/sco-organization-learners/dependent', payload);

          // then
          expect(response.statusCode).to.equal(204);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When username is used', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an HTTP response with status code 204', async function () {
          // given
          const createdUser = domainBuilder.buildUser();
          delete (payload.data.attributes as $TSFixMe).email;
          (payload.data.attributes as $TSFixMe).username = 'robert.smith1212';
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          payload.data.attributes['with-username'] = true;
          usecases.createAndReconcileUserToOrganizationLearner.resolves(createdUser);

          // when
          const response = await httpTestServer.request('POST', '/api/sco-organization-learners/dependent', payload);

          // then
          expect(response.statusCode).to.equal(204);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a NotFoundError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 404 HTTP response', async function () {
          // given
delete (payload.data.attributes as $TSFixMe).username;
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          usecases.createAndReconcileUserToOrganizationLearner.rejects(new NotFoundError());

          // when
          const response = await httpTestServer.request('POST', '/api/sco-organization-learners/dependent', payload);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePassword for api/schooling-registration-dependent-users/password-update', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
        h.response(true)
      );

      payload.data.attributes = {
        'schooling-registration-id': 1,
        'organization-id': 3,
      };

      (auth.credentials as $TSFixMe).userId = domainBuilder.buildUser().id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.updateOrganizationLearnerDependentUserPassword.resolves(generatedPassword);

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/schooling-registration-dependent-users/password-update',
          payload,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a NotFoundError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 404 HTTP response', async function () {
          // given
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new NotFoundError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/schooling-registration-dependent-users/password-update',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a UserNotAuthorizedToUpdatePasswordError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new UserNotAuthorizedToUpdatePasswordError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/schooling-registration-dependent-users/password-update',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePassword for api/sco-organization-learners/password-update', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
        h.response(true)
      );

      payload.data.attributes = {
        'organization-learner-id': 1,
        'organization-id': 3,
      };

      (auth.credentials as $TSFixMe).userId = domainBuilder.buildUser().id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.updateOrganizationLearnerDependentUserPassword.resolves(generatedPassword);

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/sco-organization-learners/password-update',
          payload,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a NotFoundError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 404 HTTP response', async function () {
          // given
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new NotFoundError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/password-update',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a UserNotAuthorizedToUpdatePasswordError is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new UserNotAuthorizedToUpdatePasswordError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/password-update',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateUsernameWithTemporaryPassword for api/schooling-registration-dependent-users/generate-username-password', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';
    const username = 'john.harry0207';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
        h.response(true)
      );
      payload.data.attributes = {
        'schooling-registration-id': 1,
        'organization-id': 3,
      };
      (auth.credentials as $TSFixMe).userId = domainBuilder.buildUser().id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.generateUsernameWithTemporaryPassword.resolves({ username, generatedPassword });

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/schooling-registration-dependent-users/generate-username-password',
          payload,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['username']).to.equal(username);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the student has not access to the organization an error is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.generateUsernameWithTemporaryPassword.rejects(
            new UserNotAuthorizedToGenerateUsernamePasswordError()
          );

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/schooling-registration-dependent-users/generate-username-password',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateUsernameWithTemporaryPassword for api/sco-organization-learners/username-password-generation', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';
    const username = 'john.harry0207';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
        h.response(true)
      );
      payload.data.attributes = {
        'organization-learner-id': 1,
        'organization-id': 3,
      };
      (auth.credentials as $TSFixMe).userId = domainBuilder.buildUser().id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.generateUsernameWithTemporaryPassword.resolves({ username, generatedPassword });

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/sco-organization-learners/username-password-generation',
          payload,
          auth
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['username']).to.equal(username);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the student has not access to the organization an error is thrown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.generateUsernameWithTemporaryPassword.rejects(
            new UserNotAuthorizedToGenerateUsernamePasswordError()
          );

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/username-password-generation',
            payload,
            auth
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
