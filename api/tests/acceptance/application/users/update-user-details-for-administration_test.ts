const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-update-user-details-for-administration', function () {
  let server: $TSFixMe;
  let user: $TSFixMe;
  let options;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    user = await insertUserWithRoleSuperAdmin();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Error case', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return bad request when payload is not valid', async function () {
      // given
      options = {
        method: 'PATCH',
        url: `/api/admin/users/${user.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        payload: {
          data: {
            id: user.id,
            attributes: {
              email: 'emailUpdated',
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(400);
      const firstError = response.result.errors[0];
      expect(firstError.detail).to.equal('"data.attributes.first-name" is required');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with not authorized error', async function () {
      // given
      options = {
        method: 'PATCH',
        url: `/api/admin/users/${user.id}`,
        payload: {
          data: {
            id: user.id,
            attributes: {
              firstName: 'firstNameUpdated',
              lastName: 'lastNameUpdated',
              email: 'emailUpdated',
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with forbidden error', async function () {
      user = databaseBuilder.factory.buildUser({ email: 'partial.update@example.net' });
      await databaseBuilder.commit();

      // given
      options = {
        method: 'PATCH',
        url: `/api/admin/users/${user.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        payload: {
          data: {
            id: user.id,
            attributes: {
              'first-name': 'firstNameUpdated',
              'last-name': 'lastNameUpdated',
              email: 'emailUpdated@example.net',
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Success case', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with 200 status code, when user details are updated', async function () {
      // given
      options = {
        method: 'PATCH',
        url: `/api/admin/users/${user.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        payload: {
          data: {
            id: user.id,
            attributes: {
              'first-name': 'firstNameUpdated',
              'last-name': 'lastNameUpdated',
              email: 'emailUpdated@example.net',
              username: 'usernameUpdated',
            },
          },
        },
      };
      const authenticationMethod = await knex('authentication-methods').where({ userId: user.id }).first();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal({
        data: {
          attributes: {
            'first-name': 'firstNameUpdated',
            'last-name': 'lastNameUpdated',
            email: 'emailUpdated@example.net',
            username: 'usernameUpdated',
            cgu: user.cgu,
            'pix-certif-terms-of-service-accepted': user.pixCertifTermsOfServiceAccepted,
            'pix-orga-terms-of-service-accepted': user.pixOrgaTermsOfServiceAccepted,
          },
          relationships: {
            'schooling-registrations': {
              data: [],
            },
            'organization-learners': {
              data: [],
            },
            'authentication-methods': {
              data: [
                {
                  id: `${authenticationMethod.id}`,
                  type: 'authenticationMethods',
                },
              ],
            },
          },
          id: '1234',
          type: 'users',
        },
        included: [
          {
            attributes: {
              'identity-provider': `${authenticationMethod.identityProvider}`,
            },
            id: `${authenticationMethod.id}`,
            type: 'authenticationMethods',
          },
        ],
      });
    });
  });
});
