// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-has-seen-challenge-tooltip', function () {
  let server: $TSFixMe;
  let user;
  let options: $TSFixMe;
  let challengeType;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Resource access management', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      challengeType = 'focused';
      user = databaseBuilder.factory.buildUser({ hasSeenFocusedChallengeTooltip: false });

      options = {
        method: 'PATCH',
        url: `/api/users/${user.id}/has-seen-challenge-tooltip/${challengeType}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
      // given
      options.headers.authorization = 'invalid.access.token';

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async function () {
      // given
      const otherUserId = 9999;
      options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Success cases', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the user with has seen challenge tooltip', async function () {
      // given
      challengeType = 'focused';
      user = databaseBuilder.factory.buildUser({ hasSeenFocusedChallengeTooltip: false });

      options = {
        method: 'PATCH',
        url: `/api/users/${user.id}/has-seen-challenge-tooltip/${challengeType}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      await databaseBuilder.commit();
      // when
      const response = await server.inject(options);

      // then
      expect(response.result.data.attributes['has-seen-focused-challenge-tooltip']).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the user with has seen other challenges tooltip', async function () {
      // given
      challengeType = 'other';
      user = databaseBuilder.factory.buildUser({ hasSeenFocusedChallengeTooltip: false });

      options = {
        method: 'PATCH',
        url: `/api/users/${user.id}/has-seen-challenge-tooltip/${challengeType}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      await databaseBuilder.commit();
      // when
      const response = await server.inject(options);

      // then
      expect(response.result.data.attributes['has-seen-other-challenges-tooltip']).to.be.true;
    });
  });
});
