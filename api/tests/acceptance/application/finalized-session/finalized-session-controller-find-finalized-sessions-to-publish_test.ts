const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | finalized-session-controller-find-finalized-sessions-to-publish', function () {
  let server: $TSFixMe, options: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/sessions/to-publish', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      options = {
        method: 'GET',
        url: '/api/admin/sessions/to-publish',
        payload: {},
      };

      databaseBuilder.factory.buildSession({ id: 121 });
      databaseBuilder.factory.buildSession({ id: 333 });
      databaseBuilder.factory.buildSession({ id: 323 });
      databaseBuilder.factory.buildSession({ id: 423 });

      databaseBuilder.factory.buildFinalizedSession({ sessionId: 121, isPublishable: true, publishedAt: null });
      databaseBuilder.factory.buildFinalizedSession({ sessionId: 333, isPublishable: true, publishedAt: null });
      databaseBuilder.factory.buildFinalizedSession({ sessionId: 323, isPublishable: false, publishedAt: null });
      databaseBuilder.factory.buildFinalizedSession({ sessionId: 423, isPublishable: true, publishedAt: '2021-01-02' });

      return databaseBuilder.commit();
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is authorized', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader() };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code response with JSON API serialized', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.have.lengthOf(2);
        expect(response.result.data[0].type).to.equal('to-be-published-sessions');
      });
    });
  });
});
