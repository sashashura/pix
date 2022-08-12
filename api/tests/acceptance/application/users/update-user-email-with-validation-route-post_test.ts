// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userEmailR... Remove this comment to see the full error message
const userEmailRepository = require('../../../../lib/infrastructure/repositories/user-email-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Users', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/users/{id}/update-email', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      // given
      const server = await createServer();

      const code = '999999';
      const newEmail = 'judy.new_email@example.net';
      const user = databaseBuilder.factory.buildUser.withRawPassword({
        email: 'judy.howl@example.net',
      });
      await databaseBuilder.commit();

      await userEmailRepository.saveEmailModificationDemand({ userId: user.id, code, newEmail });

      const payload = {
        data: {
          type: 'email-verification-codes',
          attributes: {
            code,
          },
        },
      };

      const options = {
        method: 'POST',
        url: `/api/users/${user.id}/update-email`,
        payload,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(user.id),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
