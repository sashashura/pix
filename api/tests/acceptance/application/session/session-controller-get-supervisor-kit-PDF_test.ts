// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-supervisor-kit-pdf', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/sessions/{id}/supervisor-kit', function () {
    let user: $TSFixMe, sessionIdAllowed: $TSFixMe, sessionIdNotAllowed: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildOrganization({ externalId: 'EXT1234' });
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({ externalId: 'EXT1234' }).id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId: user.id, certificationCenterId });

      const otherUserId = databaseBuilder.factory.buildUser().id;
      const otherCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: otherUserId,
        certificationCenterId: otherCertificationCenterId,
      });

      sessionIdAllowed = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
      sessionIdNotAllowed = databaseBuilder.factory.buildSession({
        certificationCenterId: otherCertificationCenterId,
      }).id;

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 200 when session can be found', async function () {
      // when
      const authHeader = generateValidRequestAuthorizationHeader(user.id);
      const token = authHeader.replace('Bearer ', '');
      const options = {
        method: 'GET',
        url: `/api/sessions/${sessionIdAllowed}/supervisor-kit?accessToken=${token}`,
        payload: {},
      };
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 403 when user cant access the session', async function () {
      // when
      const authHeader = generateValidRequestAuthorizationHeader(user.id);
      const token = authHeader.replace('Bearer ', '');
      const options = {
        method: 'GET',
        url: `/api/sessions/${sessionIdNotAllowed}/supervisor-kit?accessToken=${token}`,
        payload: {},
      };
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
