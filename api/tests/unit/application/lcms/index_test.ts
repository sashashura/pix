// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/lcms');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcmsContro... Remove this comment to see the full error message
const lcmsController = require('../../../../lib/application/lcms/lcms-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | lcms-router', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    sinon.stub(lcmsController, 'createRelease').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));

    httpTestServer = new HttpTestServer();
    httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/lcms/releases', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('POST', '/api/lcms/releases');

      // then
      expect(response.statusCode).to.equal(204);
      expect(lcmsController.createRelease).to.have.been.called;
    });
  });
});
