// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | Account-Recovery | Routes', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/account-recovery/{temporaryKey}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 http status code when account recovery demand found', async function () {
      // given
      const temporaryKey = 'FfgpFXgyuO062nPUPwcb8Wy3KcgkqR2p2GyEuGVaNI4=';
      const userId = 1234;
      const newEmail = 'newEmail@example.net';
      const firstName = 'Gertrude';
      databaseBuilder.factory.buildUser.withRawPassword({ id: userId });
      const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({ userId, firstName });
      const { id } = databaseBuilder.factory.buildAccountRecoveryDemand({
        userId,
        organizationLearnerId,
        temporaryKey,
        newEmail,
        used: false,
      });
      await databaseBuilder.commit();
      const server = await createServer();

      const options = {
        method: 'GET',
        url: '/api/account-recovery/' + temporaryKey,
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.attributes.email).to.equal(newEmail.toLowerCase());
      expect(response.result.data.attributes['first-name']).to.equal(firstName);
      expect(response.result.data.id).to.equal(id.toString());
    });
  });
});
