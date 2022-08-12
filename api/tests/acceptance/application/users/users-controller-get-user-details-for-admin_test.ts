const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-get-user-details-for-admin', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;
  let user: $TSFixMe;
  let clock: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    clock = sinon.useFakeTimers({
      now: Date.now(),
      toFake: ['Date'],
    });
    user = databaseBuilder.factory.buildUser({});
    await databaseBuilder.commit();
    options = {
      method: 'GET',
      url: `/api/admin/users/${user.id}`,
      payload: {},
      headers: {},
    };
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /admin/users/:id', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async function () {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const superAdmin = await insertUserWithRoleSuperAdmin();
        options.headers.authorization = generateValidRequestAuthorizationHeader(superAdmin.id);

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user serialized', async function () {
        // when
        const response = await server.inject(options);

        const expectedScorecardJSONApi = {
          data: {
            attributes: {
              cgu: true,
              'created-at': new Date(),
              email: user.email,
              'email-confirmed-at': null,
              'first-name': user.firstName,
              lang: 'fr',
              'last-logged-at': new Date(),
              'last-name': user.lastName,
              'last-pix-certif-terms-of-service-validated-at': null,
              'last-pix-orga-terms-of-service-validated-at': null,
              'last-terms-of-service-validated-at': null,
              'pix-certif-terms-of-service-accepted': false,
              'pix-orga-terms-of-service-accepted': false,
              username: user.username,
            },
            id: `${user.id}`,
            relationships: {
              'authentication-methods': {
                data: [],
              },
              'organization-learners': {
                data: [],
              },
              'schooling-registrations': {
                data: [],
              },
              profile: {
                links: {
                  related: `/api/admin/users/${user.id}/profile`,
                },
              },
              participations: {
                links: {
                  related: `/api/admin/users/${user.id}/participations`,
                },
              },
            },
            type: 'users',
          },
          included: undefined,
        };

        // then
        expect(response.result.data).to.deep.equal(expectedScorecardJSONApi.data);
        expect(response.result.included).to.deep.equal(expectedScorecardJSONApi.included);
      });
    });
  });
});
