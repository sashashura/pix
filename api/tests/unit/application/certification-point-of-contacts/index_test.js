const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

const moduleUnderTest = require('../../../../lib/application/certification-point-of-contacts');

const certificationPointOfContactController = require('../../../../lib/application/certification-point-of-contacts/certification-point-of-contact-controller');

describe('Unit | Application | Router | certification-point-of-contact-router', () => {

  describe('GET /api/certification-point-of-contacts/{userId}', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser').callsFake((request, h) => h.response(true));
      sinon.stub(certificationPointOfContactController, 'get').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/certification-point-of-contacts/123');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should call pre-handler', async () => {
      // given
      sinon.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser').callsFake((request, h) => h.response(true));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      await httpTestServer.request('GET', '/api/certification-point-of-contacts/123');

      // then
      sinon.assert.called(securityPreHandlers.checkRequestedUserIsAuthenticatedUser);
    });
  });
});
