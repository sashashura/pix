// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Account-recovery', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/users/{id}/account-recovery', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status codes', async function () {
      // given
      const server = await createServer();

      const userId = 1234;
      const newEmail = 'newEmail@example.net';
      const password = 'password123#A*';
      databaseBuilder.factory.buildUser.withRawPassword({ id: userId });
      const accountRecoveryDemand = databaseBuilder.factory.buildAccountRecoveryDemand({
        userId,
        temporaryKey: 'FfgpFXgyuO062nPUPwcb8Wy3KcgkqR2p2GyEuGVaNI4=',
        newEmail,
        used: false,
      });
      const temporaryKey = accountRecoveryDemand.temporaryKey;
      await databaseBuilder.commit();

      const options = {
        method: 'PATCH',
        url: '/api/account-recovery',
        payload: {
          data: {
            attributes: {
              'temporary-key': temporaryKey,
              password,
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
