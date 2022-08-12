// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-get-memberships', function () {
  let userId;
  let organization: $TSFixMe;
  let membershipId: $TSFixMe;
  let options: $TSFixMe;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const organizationRole = Membership.roles.MEMBER;
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /users/:id/memberships', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      organization = databaseBuilder.factory.buildOrganization();
      membershipId = databaseBuilder.factory.buildMembership({
        organizationId: organization.id,
        userId,
        organizationRole,
      }).id;
      await databaseBuilder.commit();

      options = {
        method: 'GET',
        url: `/api/users/${userId}/memberships`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

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
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return found memberships with 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: [
            {
              type: 'memberships',
              id: membershipId.toString(),
              attributes: {
                'organization-role': organizationRole,
              },
              relationships: {
                organization: { data: { type: 'organizations', id: organization.id.toString() } },
              },
            },
          ],
          included: [
            {
              type: 'organizations',
              id: organization.id.toString(),
              attributes: {
                name: organization.name,
                type: organization.type,
                'external-id': organization.externalId,
                'is-managing-students': organization.isManagingStudents,
              },
              relationships: {
                campaigns: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/campaigns`,
                  },
                },
                memberships: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/memberships`,
                  },
                },
                'target-profiles': {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/target-profiles`,
                  },
                },
                'organization-invitations': {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/invitations`,
                  },
                },
                students: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/students`,
                  },
                },
              },
            },
          ],
        });
      });
    });
  });
});
