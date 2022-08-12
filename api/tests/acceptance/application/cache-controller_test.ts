// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | cache-controller', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/cache/{model}/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given & when
        const response = await server.inject({
          method: 'PATCH',
          url: '/api/cache/challenges/recChallengeId',
          headers: { authorization: 'invalid.access.token' },
          payload: {
            id: 'recChallengeId',
            param: 'updatedModelParam',
          },
        });

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if user is not a Super Admin', async function () {
        // given
        const nonSuperAdminUserId = 9999;

        // when
        const response = await server.inject({
          method: 'PATCH',
          url: '/api/cache/challenges/recChallengeId',
          headers: { authorization: generateValidRequestAuthorizationHeader(nonSuperAdminUserId) },
          payload: {
            id: 'recChallengeId',
            param: 'updatedModelParam',
          },
        });

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/cache', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given & when
        const response = await server.inject({
          method: 'PATCH',
          url: '/api/cache',
          headers: { authorization: 'invalid.access.token' },
        });

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if user is not a Super Admin', async function () {
        // given
        const nonSuperAdminUserId = 9999;

        // when
        const response = await server.inject({
          method: 'PATCH',
          url: '/api/cache',
          headers: { authorization: generateValidRequestAuthorizationHeader(nonSuperAdminUserId) },
        });

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
