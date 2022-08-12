// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/certification-centers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterController = require('../../../../lib/application/certification-centers/certification-center-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | certification-center-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-centers/{certificationCenterId}/divisions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid certification center id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/certification-centers/invalid/divisions');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-centers/{certificationCenterId}/sessions/{sessionId}/students', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject unexpected filters ', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?filter[unexpected][]=5'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept a string array of one element as division filter ', async function () {
      // given
      sinon.stub(certificationCenterController, 'getStudents').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?filter[divisions][]="3EMEB"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept a string array of several elements as division filter ', async function () {
      // given
      sinon.stub(certificationCenterController, 'getStudents').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject a division filter if it is not an array', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?filter[divisions]="3EMEA"'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept a pagination', async function () {
      // given
      sinon.stub(certificationCenterController, 'getStudents').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?page[number]=1&page[size]=25'
      );

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject a page number which is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?page[number]=a'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject a page size which is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      // when
      const result = await httpTestServer.request(
        'GET',
        '/api/certification-centers/1/sessions/2/students?page[size]=a'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept an empty query string', async function () {
      // given
      sinon.stub(certificationCenterController, 'getStudents').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/2/students');

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid certification-centers id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/certification-centers/invalid/sessions/2/students');

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid session id', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/certification-centers/1/sessions/invalid/students');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-centers/{certificationCenterId}/certification-center-memberships', function () {
    const method = 'GET';
    const url = '/api/certification-centers/1/certification-center-memberships';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      //given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon
        .stub(certificationCenterController, 'findCertificationCenterMembershipsByCertificationCenter')
        .returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(method, url);

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid certification-centers id', async function () {
      //given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      // when
      const result = await httpTestServer.request(
        method,
        '/api/certification-centers/invalid/certification-center-memberships'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-centers/{certificationCenterId}/certification-center-memberships', function () {
    const method = 'POST';
    const url = '/api/certification-centers/1/certification-center-memberships';
    const email = 'user@example.net';
    const payload = { email };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return CREATED (200) when everything does as expected', async function () {
      //given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(certificationCenterController, 'createCertificationCenterMembershipByEmail').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(method, url, payload);

      // then
      expect(result.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid certification-centers id', async function () {
      //given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(
        method,
        '/api/certification-centers/invalid/certification-center-memberships'
      );

      // then
      expect(result.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an invalid email', async function () {
      //given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      payload.email = 'invalid email';

      // when
      const result = await httpTestServer.request(method, url, payload);

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certification-centers/{certificationCenterId}/session-summaries', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(certificationCenterController, 'findPaginatedSessionSummaries').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/certification-centers/123/session-summaries');

      // then
      expect(response.statusCode).to.equal(200);
      sinon.assert.calledOnce(certificationCenterController.findPaginatedSessionSummaries);
    });
  });
});
