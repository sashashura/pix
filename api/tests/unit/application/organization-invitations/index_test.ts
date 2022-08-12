// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organization-invitations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationController = require('../../../../lib/application/organization-invitations/organization-invitation-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | organization-invitation-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organization-invitations/{id}/response', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exists', async function () {
      // given
      sinon
        .stub(organizationInvitationController, 'acceptOrganizationInvitation')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'POST';
      const url = '/api/organization-invitations/1/response';
      const payload = {
        data: {
          id: '100047_DZWMP7L5UM',
          type: 'organization-invitation-responses',
          attributes: {
            code: 'DZWMP7L5UM',
            email: 'user@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organization-invitations/{id}', function () {
    const method = 'GET';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exists', async function () {
      // given
      sinon
        .stub(organizationInvitationController, 'getOrganizationInvitation')
        .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/organization-invitations/1?code=DZWMP7L5UM';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return Bad Request Error when invitation identifier is not a number', async function () {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const url = '/api/organization-invitations/XXXXXXXXXXXXXXXX15812?code=DZWMP7L5UM';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
