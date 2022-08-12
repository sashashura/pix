// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('POST /api/admin/sessions/publish-in-batch', function () {
  let server: $TSFixMe;
  const options = {
    method: 'POST',
    url: '/api/admin/sessions/publish-in-batch',
  };
  let userId;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    // given
    userId = databaseBuilder.factory.buildUser.withRole().id;
    (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };
    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session id is a number', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 207 error code', async function () {
        // given
(options as $TSFixMe).payload = { data: { attributes: { ids: [1] } } };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(207);
        expect(response.result).to.nested.include({ 'errors[0].code': 'SESSION_PUBLICATION_BATCH_PARTIALLY_FAILED' });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all the sessions exists', function () {
      let sessionId;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sessionId = databaseBuilder.factory.buildSession({ publishedAt: null }).id;
        databaseBuilder.factory.buildFinalizedSession({ sessionId });
        (options as $TSFixMe).payload = { data: { attributes: { ids: [sessionId] } } };
        databaseBuilder.factory.buildCertificationCourse({ sessionId, isPublished: false });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 204 status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});
