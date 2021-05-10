const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

const moduleUnderTest = require('../../../../lib/application/certification-centers');

const certificationCenterController = require('../../../../lib/application/certification-centers/certification-center-controller');

describe('Unit | Application | Router | certification-center-router', () => {

  describe('GET /api/certification-centers/{certificationCenterId}/sessions/{sessionId}/students', () => {

    context('success cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        sinon.stub(certificationCenterController, 'getStudents').returns('ok');
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 200 with a string array of one element as division filter ', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?filter[divisions][]="3EMEB"');

        // then
        expect(response.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of several elements as division filter ', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"');

        // then
        expect(response.statusCode).to.equal(200);
      });

      it('should return 200 with pagination', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?page[number]=1&page[size]=25');

        // then
        expect(response.statusCode).to.equal(200);
      });

      it('should return 200 with an empty query string', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students');

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    context('error cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 400 with unexpected filters ', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?filter[unexpected][]=5');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with a division filter if it is not an array', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?filter[divisions]="3EMEA"');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with a page number which is not a number', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?page[number]=a');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with a page size which is not a number', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students?page[size]=a');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with an invalid certification-centers id', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/invalid/sessions/2/students');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with an invalid session id', async () => {
        // when
        const response = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/invalid/students');

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /api/certification-centers/{certificationCenterId}/divisions', () => {

    it('should return 400 with an invalid certification center id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/certification-centers/invalid/divisions');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/certification-centers/{certificationCenterId}/certification-center-memberships', () => {

    const method = 'GET';
    const url = '/api/certification-centers/1/certification-center-memberships';

    it('should return 200', async () => {
      //given
      sinon.stub(securityPreHandlers, 'checkUserHasRolePixMaster').callsFake((request, h) => h.response(true));
      sinon.stub(certificationCenterController, 'findCertificationCenterMembershipsByCertificationCenter').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid certification-centers id', async () => {
      //given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(method, '/api/certification-centers/invalid/certification-center-memberships');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('POST /api/certification-centers/{certificationCenterId}/certification-center-memberships', () => {

    it('should return 200', async () => {
      //given
      sinon.stub(securityPreHandlers, 'checkUserHasRolePixMaster').callsFake((request, h) => h.response(true));
      sinon.stub(certificationCenterController, 'createCertificationCenterMembershipByEmail').callsFake((request, h) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        email: 'user@example.net',
      };

      // when
      const response = await httpTestServer.request('POST', '/api/certification-centers/1/certification-center-memberships', payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    context('error cases', () => {

      it('should return 403 with an user without PixMaster role', async () => {
        // given
        sinon.stub(securityPreHandlers, 'checkUserHasRolePixMaster').callsFake((request, h) => h.response().code(403).takeover());
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const payload = {
          email: 'user@example.net',
        };

        // when
        const response = await httpTestServer.request('POST', '/api/certification-centers/1/certification-center-memberships', payload);

        // then
        expect(response.statusCode).to.equal(403);
      });

      it('should return 400 with an invalid certification-centers id', async () => {
        //given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('POST', '/api/certification-centers/invalid/certification-center-memberships');

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should return 400 with an invalid email', async () => {
        //given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const payload = {
          email: 'invalid email',
        };

        // when
        const response = await httpTestServer.request('POST', '/api/certification-centers/1/certification-center-memberships', payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

});
