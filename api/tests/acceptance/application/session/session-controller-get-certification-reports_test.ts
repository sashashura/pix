// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-certification-reports', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /sessions/{id}/certification-reports', function () {
    let sessionId: $TSFixMe;
    let userId: $TSFixMe;
    let certificationCenterId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      ({ id: sessionId, certificationCenterId } = databaseBuilder.factory.buildSession());

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has no access to session resources', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 404 HTTP status code (to keep opacity on whether forbidden or not found)', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/sessions/${sessionId}/certification-reports`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.statusCode).to.equal(404);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has access to session resources', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // given
        userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
        await databaseBuilder.commit();

        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/sessions/${sessionId}/certification-reports`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
