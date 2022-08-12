// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-for-supervising-controller-get', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when en test screen removal is enabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return OK and a sessionForSupervisings type', async function () {
      // given
      databaseBuilder.factory.buildCertificationCenter({ id: 345, isSupervisorAccessEnabled: true });
      databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
      databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ userId, sessionId: 121 });
      await databaseBuilder.commit();

      const headers = { authorization: generateValidRequestAuthorizationHeader(userId, 'pix-certif') };

      const options = {
        headers,
        method: 'GET',
        url: '/api/sessions/121/supervising',
        payload: {},
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.type).to.equal('sessionForSupervising');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when end test screen removal is not enabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 HTTP status code ', async function () {
      databaseBuilder.factory.buildCertificationCenter({ id: 345, isSupervisorAccessEnabled: false });
      databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
      databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ userId, sessionId: 121 });
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/sessions/121/supervising',
        payload: {},
      };
      (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(401);
    });
  });
});
