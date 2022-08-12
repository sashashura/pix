// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organization-invitations/index');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organisationInvitationController = require('../../../../lib/application/organization-invitations/organization-invitation-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Organization-invitations | Routes', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon
      .stub(organisationInvitationController, 'acceptOrganizationInvitation')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(204));
    sinon.stub(organisationInvitationController, 'sendScoInvitation').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(201));
    sinon
      .stub(organisationInvitationController, 'getOrganizationInvitation')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().code(200));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organization-invitations/:id/response', function () {
    const method = 'POST';
    const url = '/api/organization-invitations/1/response';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 when payload is valid', async function () {
      // given
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 when payload is missing', async function () {
      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organization-invitations/sco', function () {
    const method = 'POST';
    const url = '/api/organization-invitations/sco';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should send invitation when payload is valid', async function () {
      // given
      const payload = {
        data: {
          type: 'sco-organization-invitations',
          attributes: {
            uai: '1234567A',
            'first-name': 'john',
            'last-name': 'harry',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return bad request when payload is not valid', async function () {
      // given
      const payload = {
        data: {
          type: 'sco-organization-invitations',
          attributes: {
            uai: '1234567A',
            lastName: 'harry',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organization-invitations/:id', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 when query is valid', async function () {
      // when
      const response = await httpTestServer.request('GET', '/api/organization-invitations/1?code=DZWMP7L5UM');

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 when query is invalid', async function () {
      // when
      const response = await httpTestServer.request('GET', '/api/organization-invitations/1');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
