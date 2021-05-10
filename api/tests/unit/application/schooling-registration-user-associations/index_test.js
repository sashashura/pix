const {
  expect,
  generateValidRequestAuthorizationHeader,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

const moduleUnderTest = require('../../../../lib/application/schooling-registration-user-associations');

const schoolingRegistrationUserAssociationController = require('../../../../lib/application/schooling-registration-user-associations/schooling-registration-user-association-controller');

describe('Unit | Application | Router | schooling-registration-user-associations-router', () => {

  const organizationId = 2;
  const schoolingRegistrationId = '1234';
  const userId = 2;
  let headers;

  beforeEach(() => {
    headers = {
      authorization: generateValidRequestAuthorizationHeader(userId),
    };
  });

  describe('PATCH /api/organizations/{id}/schooling-registration-user-associations/{schoolingRegistrationId}', () => {

    const method = 'PATCH';

    context('when the user is authenticated', () => {

      it('should return 200', async () => {
        // given
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents').callsFake((request, h) => h.response(true));
        sinon.stub(schoolingRegistrationUserAssociationController, 'updateStudentNumber').callsFake((request, h) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${schoolingRegistrationId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(200);
      });

      it('should return a 422 status error when student-number parameter is not a string', async () => {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${schoolingRegistrationId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': 1234,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(422);
        expect(responsePayload.errors[0].title).to.equal('Unprocessable entity');
        expect(responsePayload.errors[0].detail).to.equal('Un des champs saisis n’est pas valide.');
      });

      it('should return a 404 status error when organizationId parameter is not a number', async () => {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const url = `/api/organizations/FAKE_ORGANIZATION_ID/schooling-registration-user-associations/${schoolingRegistrationId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });

      it('should return a 404 status error when schoolingRegistrationId parameter is not a number', async () => {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/FAKE_STUDENT_ID`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });
    });

    context('when the user is not authenticated', () => {

      it('should return an error when the user is not authenticated', async () => {
        // given
        sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents').callsFake((request, h) => h.response().code(403).takeover());
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${schoolingRegistrationId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });

  describe('DELETE /api/schooling-registration-user-associations/{id}', () => {

    const method = 'DELETE';
    const payload = null;

    it('should return a HTTP status code 200', async () => {
      // given
      sinon.stub(schoolingRegistrationUserAssociationController, 'dissociate').callsFake((request, h) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/schooling-registration-user-associations/1';

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return a HTTP status code 400 if id parameter is not a number', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/schooling-registration-user-associations/ABC';

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

});
