// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerController = require('../../../../lib/application/organization-learners/organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organization-learners');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | organization-learner-router', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('Routes /admin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('DELETE /api/admin/organization-learners/{id}/association', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a HTTP status code 204 when user role is "SUPER_ADMIN"', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        sinon.stub(organizationLearnerController, 'dissociate').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('DELETE', '/api/admin/organization-learners/1/association');

        // then
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin);
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSupport);
        sinon.assert.calledOnce(organizationLearnerController.dissociate);
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a HTTP status code 204 when user role is "SUPPORT"', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
        sinon.stub(organizationLearnerController, 'dissociate').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('DELETE', '/api/admin/organization-learners/1/association');

        // then
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin);
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSupport);
        sinon.assert.calledOnce(organizationLearnerController.dissociate);
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a HTTP status code 403 when user does not have access (CERTIF | METIER)', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        sinon
          .stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport')
          .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        sinon.stub(organizationLearnerController, 'dissociate').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('DELETE', '/api/admin/organization-learners/1/association');

        // then
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSuperAdmin);
        sinon.assert.calledOnce(securityPreHandlers.checkAdminMemberHasRoleSupport);
        sinon.assert.notCalled(organizationLearnerController.dissociate);
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a HTTP status code 400 if id parameter is not a number', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('DELETE', '/api/admin/organization-learners/ABC/association');

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/schooling-registration-user-associations/{id}', function () {
    const method = 'DELETE';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a HTTP status code 204', async function () {
      // given
      sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(organizationLearnerController, 'dissociate').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/schooling-registration-user-associations/1';

      // when
      const response = await httpTestServer.request(method, url, null);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a HTTP status code 403 when user does not have rights to Pix Admin', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf')
        .returns((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/schooling-registration-user-associations/1';

      // when
      const response = await httpTestServer.request(method, url, null);

      // then
      expect(response.statusCode).to.equal(403);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a HTTP status code 400 if id parameter is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/schooling-registration-user-associations/ABC';

      // when
      const response = await httpTestServer.request(method, url, null);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organization-learners', function () {
    const method = 'GET';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a HTTP status code 200', async function () {
      // given
      sinon
        .stub(organizationLearnerController, 'findAssociation')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/organization-learners?userId=1&campaignCode=ABCDEF123';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
