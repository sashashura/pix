// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/tags');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagControl... Remove this comment to see the full error message
const tagController = require('../../../../lib/application/tags/tag-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | tag-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/tags', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return a response with an http status code OK', async function () {
      // given
      const tags = [
        domainBuilder.buildTag({ name: 'TAG1' }),
        domainBuilder.buildTag({ name: 'TAG2' }),
        domainBuilder.buildTag({ name: 'TAG3' }),
      ];

      sinon.stub(tagController, 'findAllTags').returns(tags);
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/tags');

      // then
      expect(response.statusCode).to.equal(200);
      sinon.assert.calledOnce(tagController.findAllTags);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/tags', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns forbidden access if admin member has CERTIF or SUPPORT or METIER role', async function () {
      // given
      sinon.stub(tagController, 'create').resolves('ok');

      sinon
        .stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleMetier').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/admin/tags', {
        data: {
          type: 'tags',
          attributes: {
            name: 'Super Tag',
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(403);
      sinon.assert.notCalled(tagController.create);
    });
  });
});
