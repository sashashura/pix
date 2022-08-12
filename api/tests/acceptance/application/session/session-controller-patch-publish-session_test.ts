// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('PATCH /api/admin/sessions/:id/publish', function () {
  let server: $TSFixMe;
  const options = { method: 'PATCH' };
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user does not have the role Super Admin', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 403 error code', async function () {
      // given
(options as $TSFixMe).url = '/api/admin/sessions/1/publish';
      (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has role Super Admin', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      userId = databaseBuilder.factory.buildUser.withRole().id;
      (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session id has an invalid format', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 400 error code', async function () {
        // given
(options as $TSFixMe).url = '/api/admin/sessions/any/publish';

        // when
        const response = await server.inject(options);

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
(options as $TSFixMe).url = '/api/admin/sessions/1/publish';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session exists', function () {
        let sessionId;
        let certificationId: $TSFixMe;
        const date = new Date('2000-01-01T10:00:00Z');

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          sessionId = databaseBuilder.factory.buildSession({ publishedAt: null }).id;
          databaseBuilder.factory.buildFinalizedSession({ sessionId });
          (options as $TSFixMe).url = `/api/admin/sessions/${sessionId}/publish`;
          certificationId = databaseBuilder.factory.buildCertificationCourse({ sessionId, isPublished: false }).id;
          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 200 status code', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the serialized session with an updated publishedAt date', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.result.data.attributes['published-at']).to.be.an.instanceOf(Date);
          expect(response.result.data.attributes['published-at']).to.not.equal(date);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update the isPublished field in certification course', async function () {
          // when
          await server.inject(options);

          // then
          const certificationCourses = await knex('certification-courses').where({ id: certificationId });
          expect(certificationCourses[0].isPublished).to.be.true;
        });
      });
    });
  });
});
