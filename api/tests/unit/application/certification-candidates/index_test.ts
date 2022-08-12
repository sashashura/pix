// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/certification-candidates');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalEnabled = require('../../../../lib/application/preHandlers/end-test-screen-removal-enabled');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionSup... Remove this comment to see the full error message
const sessionSupervisorAuthorization = require('../../../../lib/application/preHandlers/session-supervisor-authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCandidatesController = require('../../../../lib/application/certification-candidates/certification-candidates-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | CertificationCandidates | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET certification-candidates/{id}/authorize-to-start', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 if the user is a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      //given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(certificationCandidatesController, 'authorizeToStart').returns('ok');

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = { 'authorized-to-start': true };

      // when
      const response = await httpTestServer.request(
        'POST',
        '/api/certification-candidates/1/authorize-to-start',
        payload
      );

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 if the user is not a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      //given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(401).takeover());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = { 'authorized-to-start': true };

      // when
      const response = await httpTestServer.request(
        'POST',
        '/api/certification-candidates/1/authorize-to-start',
        payload
      );

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 if the certification center is not in the whitelist', async function () {
      //given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(404).takeover());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = { 'authorized-to-start': true };

      // when
      const response = await httpTestServer.request(
        'POST',
        '/api/certification-candidates/1/authorize-to-start',
        payload
      );

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST certification-candidates/{id}/authorize-to-resume', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 if the user is a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(certificationCandidatesController, 'authorizeToResume')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-candidates/1/authorize-to-resume');

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 if the user is not a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(401).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-candidates/1/authorize-to-resume');

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 if the certification center is not in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(404).takeover());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-candidates/1/authorize-to-resume');

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH certification-candidates/{id}/end-assessment-by-supervisor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 if the user is a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(certificationCandidatesController, 'endAssessmentBySupervisor').returns(null);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(
        'PATCH',
        '/api/certification-candidates/1/end-assessment-by-supervisor'
      );

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 if the user is not a supervisor of the session linked to the candidate and certification center is in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon
        .stub(sessionSupervisorAuthorization, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(401).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(
        'PATCH',
        '/api/certification-candidates/1/end-assessment-by-supervisor'
      );

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 if the certification center is not in the whitelist', async function () {
      // given
      sinon
        .stub(endTestScreenRemovalEnabled, 'verifyByCertificationCandidateId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(404).takeover());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request(
        'PATCH',
        '/api/certification-candidates/1/end-assessment-by-supervisor'
      );

      // then
      expect(response.statusCode).to.equal(404);
    });
  });
});
