// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportController = require('../../../../lib/application/certification-issue-reports/certification-issue-report-controller');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/certification-issue-reports');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Certifications Issue Report | Route', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/certification-issue-reports/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 200', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(certificationIssueReportController, 'deleteCertificationIssueReport').returns('ok');

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('DELETE', '/api/certification-issue-reports/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/certification-issue-reports/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no resolution is given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 204', async function () {
        // given
        sinon.stub(certificationIssueReportController, 'manuallyResolve').callsFake((_: $TSFixMe, h: $TSFixMe) => h.response().code(204));
        sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);

        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('PATCH', '/api/certification-issue-reports/1', {
          data: {
            resolution: null,
          },
        });

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return forbidden access if user has METIER role', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .withArgs([
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
          securityPreHandlers.checkAdminMemberHasRoleCertif,
          securityPreHandlers.checkAdminMemberHasRoleSupport,
        ])
        .callsFake(
          () => (request: $TSFixMe, h: $TSFixMe) =>
            h
              .response({ errors: new Error('forbidden') })
              .code(403)
              .takeover()
        );

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/certification-issue-reports/1', {
        data: {
          resolution: null,
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });
});
