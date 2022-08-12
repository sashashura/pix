// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | Prescriber-controller', function () {
  let user: $TSFixMe;
  let organization: $TSFixMe;
  let membership: $TSFixMe;
  let userOrgaSettingsId: $TSFixMe;
  let options: $TSFixMe;
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  function createExpectedPrescriber({
    user,
    membership,
    userOrgaSettingsId,
    organization
  }: $TSFixMe) {
    return {
      data: {
        type: 'prescribers',
        attributes: {
          'first-name': user.firstName,
          'last-name': user.lastName,
          'pix-orga-terms-of-service-accepted': false,
          'are-new-year-organization-learners-imported': false,
          lang: user.lang,
        },
        relationships: {
          memberships: {
            data: [
              {
                id: membership.id.toString(),
                type: 'memberships',
              },
            ],
          },
          'user-orga-settings': {
            data: {
              id: userOrgaSettingsId.toString(),
              type: 'userOrgaSettings',
            },
          },
        },
      },
      included: [
        {
          id: organization.id.toString(),
          type: 'organizations',
          attributes: {
            credit: organization.credit,
            'external-id': organization.externalId,
            'is-managing-students': organization.isManagingStudents,
            name: organization.name,
            type: organization.type,
          },
          relationships: {
            divisions: {
              links: {
                related: `/api/organizations/${organization.id}/divisions`,
              },
            },
            memberships: {
              links: {
                related: `/api/organizations/${organization.id}/memberships`,
              },
            },
            groups: {
              links: {
                related: `/api/organizations/${organization.id}/groups`,
              },
            },
            'organization-invitations': {
              links: {
                related: `/api/organizations/${organization.id}/invitations`,
              },
            },
            students: {
              links: {
                related: `/api/organizations/${organization.id}/students`,
              },
            },
            'target-profiles': {
              links: {
                related: `/api/organizations/${organization.id}/target-profiles`,
              },
            },
          },
        },
        {
          id: membership.id.toString(),
          type: 'memberships',
          attributes: {
            'organization-role': membership.organizationRole,
          },
          relationships: {
            organization: {
              data: {
                id: organization.id.toString(),
                type: 'organizations',
              },
            },
          },
        },
        {
          id: userOrgaSettingsId.toString(),
          type: 'userOrgaSettings',
          attributes: {
            user: undefined,
          },
          relationships: {
            organization: {
              data: {
                id: organization.id.toString(),
                type: 'organizations',
              },
            },
          },
        },
      ],
    };
  }

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/prescription/prescribers/:id', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization({
        credit: 5,
        isManagingStudents: true,
      });
      membership = databaseBuilder.factory.buildMembership({ organizationId: organization.id, userId: user.id });
      userOrgaSettingsId = databaseBuilder.factory.buildUserOrgaSettings({
        currentOrganizationId: organization.id,
        userId: user.id,
      }).id;

      await databaseBuilder.commit();

      options = {
        method: 'GET',
        url: `/api/prescription/prescribers/${user.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
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
      it('should 200 HTTP status code', async function () {
        // given
        const expectedPrescriber = createExpectedPrescriber({ user, membership, userOrgaSettingsId, organization });

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(_.omit(response.result, ['data.id'])).to.deep.equal(expectedPrescriber);
      });
    });
  });
});
