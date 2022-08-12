// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cacheContr... Remove this comment to see the full error message
const cacheController = require('../../../../lib/application/cache/cache-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | cache-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/cache/{model}/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      //given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(cacheController, 'refreshCacheEntry').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const updatedRecord = { id: 'recId', param: 'updatedValue' };

      // when
      const response = await httpTestServer.request('PATCH', '/api/cache/table/recXYZ1234', updatedRecord);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/cache', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      //given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(cacheController, 'refreshCacheEntries').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/cache');

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
