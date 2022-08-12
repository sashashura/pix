// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/complementary-certifications');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
const complementaryCertificationController = require('../../../../lib/application/complementary-certifications/complementary-certification-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | complementary-certifications-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/habilitations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 HTTP status code when the user authenticated is not SuperAdmin', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInOrganization')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      sinon.stub(complementaryCertificationController, 'findComplementaryCertifications').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/habilitations');

      // then
      expect(response.statusCode).to.equal(403);
      sinon.assert.notCalled(complementaryCertificationController.findComplementaryCertifications);
    });
  });
});
