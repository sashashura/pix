// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('PUT /api/admin/sessions/:id/results-sent-to-prescriber', function () {
  let server: $TSFixMe;
  const options = { method: 'PUT' };
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
(options as $TSFixMe).url = '/api/admin/sessions/12/results-sent-to-prescriber';
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
(options as $TSFixMe).url = '/api/admin/sessions/any/results-sent-to-prescriber';

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
(options as $TSFixMe).url = '/api/admin/sessions/1/results-sent-to-prescriber';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session exists', function () {
        let sessionId: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the session results were already flagged as sent to prescriber', function () {
          const date = new Date();

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            // given
            sessionId = databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: date }).id;
            (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };
            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a 200 status code', async function () {
            // given
(options as $TSFixMe).url = `/api/admin/sessions/${sessionId}/results-sent-to-prescriber`;

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(200);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the serialized session with an untouched resultsSentToPrescriberAt date', async function () {
            // given
(options as $TSFixMe).url = `/api/admin/sessions/${sessionId}/results-sent-to-prescriber`;

            // when
            const response = await server.inject(options);

            // then
            expect(response.result.data.attributes['results-sent-to-prescriber-at']).to.deep.equal(date);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the session results were not flagged as sent to prescriber', function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            // given
            sessionId = databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null }).id;
            (options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(userId) };
            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a 201 status code', async function () {
            // given
(options as $TSFixMe).url = `/api/admin/sessions/${sessionId}/results-sent-to-prescriber`;

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(201);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the serialized session with a defined resultsSentToPrescriberAt date', async function () {
            // given
(options as $TSFixMe).url = `/api/admin/sessions/${sessionId}/results-sent-to-prescriber`;

            // when
            const response = await server.inject(options);

            // then
            expect(response.result.data.attributes['results-sent-to-prescriber-at']).to.be.an.instanceOf(Date);
          });
        });
      });
    });
  });
});
