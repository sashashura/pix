// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('PATCH /api/admin/sessions/:id/certification-officer-assignment', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user does not have the role Super Admin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 403 error code', async function () {
      // given
      const certificationOfficerId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/admin/sessions/12/certification-officer-assignment',
        headers: { authorization: generateValidRequestAuthorizationHeader(certificationOfficerId) },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has role Super Admin', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session id has an invalid format', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error code', async function () {
        // given
        const certificationOfficerId = databaseBuilder.factory.buildUser.withRole().id;
        await databaseBuilder.commit();

        // when
        const response = await server.inject({
          method: 'PATCH',
          headers: { authorization: generateValidRequestAuthorizationHeader(certificationOfficerId) },
          url: '/api/admin/sessions/test/certification-officer-assignment',
        });

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session id is a number', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session does not exist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 404 error code', async function () {
          // given
          const certificationOfficerId = databaseBuilder.factory.buildUser.withRole().id;
          await databaseBuilder.commit();

          // when
          const response = await server.inject({
            method: 'PATCH',
            headers: { authorization: generateValidRequestAuthorizationHeader(certificationOfficerId) },
            url: '/api/admin/sessions/1/certification-officer-assignment',
          });

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 200 status code', async function () {
          // given
          const certificationOfficerId = databaseBuilder.factory.buildUser.withRole().id;
          const sessionId = databaseBuilder.factory.buildSession().id;
          databaseBuilder.factory.buildFinalizedSession({
            sessionId,
            isPublishable: true,
          });
          await databaseBuilder.commit();

          // when
          const response = await server.inject({
            method: 'PATCH',
            headers: { authorization: generateValidRequestAuthorizationHeader(certificationOfficerId) },
            url: `/api/admin/sessions/${sessionId}/certification-officer-assignment`,
          });

          // then
          expect(response.statusCode).to.equal(200);
        });
      });
    });
  });
});
