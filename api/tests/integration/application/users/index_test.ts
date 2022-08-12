// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userContro... Remove this comment to see the full error message
const userController = require('../../../../lib/application/users/user-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/users');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Users | Routes', function () {
  const methodGET = 'GET';
  const methodPATCH = 'PATCH';

  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf');
    sinon
      .stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

    sinon.stub(userController, 'getUserDetailsForAdmin').returns('ok');
    sinon.stub(userController, 'updateUserDetailsForAdministration').returns('updated');
    sinon.stub(userController, 'resetScorecard').returns('ok');
    sinon.stub(userController, 'rememberUserHasSeenChallengeTooltip').returns('ok');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/users', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user create account before joining campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return HTTP 201', async function () {
        // given / when
        const response = await httpTestServer.request('POST', '/api/users', {
          data: {
            attributes: {
              'first-name': 'marine',
              'last-name': 'test',
              email: 'test1@example.net',
              username: null,
              password: 'Password123',
              cgu: true,
              'must-validate-terms-of-service': false,
              'has-seen-assessment-instructions': false,
              'has-seen-new-dashboard-info': false,
              lang: 'fr',
              'is-anonymous': false,
            },
            type: 'users',
          },
          meta: {
            'campaign-code': 'TRWYWV411',
          },
        });

        // then
        expect(response.statusCode).to.equal(201);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return HTTP 400', async function () {
        // given
        const payload = {};

        const url = '/api/users';

        // when
        const response = await httpTestServer.request('POST', url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/users/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);
      const url = '/api/admin/users/123';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return BAD_REQUEST (400) when id in param is not a number"', async function () {
      // given
      const url = '/api/admin/users/NOT_A_NUMBER';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return BAD_REQUEST (400) when id in param is out of range"', async function () {
      // given
      const url = '/api/admin/users/0';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/users/{userId}/competences/{competenceId}/reset', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return OK (200) when params are valid', async function () {
      // given
      securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      const url = '/api/users/123/competences/abcdefghijklmnop/reset';

      // when
      const response = await httpTestServer.request('POST', url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return BAD_REQUEST (400) when competenceId parameter is invalid', async function () {
      // given
      const invalidCompetenceId = 'A'.repeat(256);
      securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      const url = `/api/users/123/competences/${invalidCompetenceId}/reset`;

      // when
      const response = await httpTestServer.request('POST', url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/users/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update user when payload is valid', async function () {
      // given
      securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);
      const url = '/api/admin/users/123';

      const payload = {
        data: {
          id: '123',
          attributes: {
            'first-name': 'firstNameUpdated',
            'last-name': 'lastNameUpdated',
            email: 'emailUpdated@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return bad request when firstName is missing', async function () {
      // given
      securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);
      const url = '/api/admin/users/123';

      const payload = {
        data: {
          id: '123',
          attributes: {
            'last-name': 'lastNameUpdated',
            email: 'emailUpdated@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
      const firstError = response.result.errors[0];
      expect(firstError.detail).to.equal('"data.attributes.first-name" is required');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return bad request when lastName is missing', async function () {
      // given
      securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns((request: $TSFixMe, h: $TSFixMe) => h.response().code(403).takeover());
      const url = '/api/admin/users/123';
      const payload = {
        data: {
          id: '123',
          attributes: {
            'first-name': 'firstNameUpdated',
            email: 'emailUpdated',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
      const firstError = response.result.errors[0];
      expect(firstError.detail).to.equal('"data.attributes.last-name" is required');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 400 when id in param is not a number"', async function () {
      // given
      const url = '/api/admin/users/NOT_A_NUMBER';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/users/{id}/has-seen-challenge-tooltip/{challengeType}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 - Bad request when challengeType is not valid', async function () {
      // given
      const url = '/api/users/1/has-seen-challenge-tooltip/invalid';

      // when
      const response = await httpTestServer.request(methodPATCH, url, {});

      // then
      expect(response.statusCode).to.equal(400);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 when challengeType is valid', async function () {
      // given
      const url = '/api/users/1/has-seen-challenge-tooltip/other';

      // when
      const response = await httpTestServer.request(methodPATCH, url, {});

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
