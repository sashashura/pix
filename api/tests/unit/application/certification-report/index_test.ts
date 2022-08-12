// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationReportController = require('../../../../lib/application/certification-reports/certification-report-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authorizat... Remove this comment to see the full error message
const authorization = require('../../../../lib/application/preHandlers/authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/certification-reports');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Certifications Report | Route', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-reports/{id}/certification-issue-reports', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 200', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(certificationReportController, 'saveCertificationIssueReport').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-reports/1/certification-issue-reports');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-reports/{id}/abort', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Returns HTTP 200 if the logged user has access to the session', async function () {
      // given
      sinon.stub(authorization, 'verifyCertificationSessionAuthorization').returns('ok');
      sinon.stub(certificationReportController, 'abort').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-reports/1/abort');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Returns HTTP 404 if the logged user is not allowed to access the session', async function () {
      // given
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      sinon.stub(authorization, 'verifyCertificationSessionAuthorization').throws(new NotFoundError('coucou'));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-reports/1/abort');

      const parsedPayload = JSON.parse(response.payload);
      const errorMessage = parsedPayload.errors[0].detail;

      // then
      expect(response.statusCode).to.equal(404);
      expect(errorMessage).to.equal('coucou');
    });
  });
});
