const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-generate-session-results-download-link', function () {
  let server: $TSFixMe;

  const sessionId = 121;
  const options = {
    method: 'GET',
    url: `/api/admin/sessions/${sessionId}/generate-results-download-link`,
    payload: {},
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/sessions/{id}/generate-results-download-link', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is Super Admin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code response', async function () {
        databaseBuilder.factory.buildSession({ id: sessionId });
        await databaseBuilder.commit();

        // when
(options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader() };
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not SuperAdmin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code', async function () {
        // when
(options as $TSFixMe).headers = { authorization: generateValidRequestAuthorizationHeader(1111) };
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not connected', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status code if user is not authenticated', async function () {
        // when
(options as $TSFixMe).headers = {};
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
