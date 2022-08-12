// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader, knex } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | membership-controller', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/memberships', function () {
    let options: $TSFixMe;
    let userId: $TSFixMe;
    let organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      userId = databaseBuilder.factory.buildUser().id;
      const adminUserId = databaseBuilder.factory.buildUser.withRole().id;
      await databaseBuilder.commit();

      options = {
        method: 'POST',
        url: '/api/admin/memberships',
        payload: {
          data: {
            type: 'memberships',
            attributes: {},
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: userId,
                },
              },
              organization: {
                data: {
                  type: 'organizations',
                  id: organizationId,
                },
              },
            },
          },
        },
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminUserId),
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('memberships').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the created membership', async function () {
        // given
        const expectedMembership = {
          data: {
            type: 'memberships',
            attributes: {
              'organization-role': 'ADMIN',
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: userId.toString(),
                },
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        expect(_.omit(response.result, ['included', 'data.id'])).to.deep.equal(expectedMembership);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When a membership is disabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should be able to recreate it', async function () {
          // given
          databaseBuilder.factory.buildMembership({ userId, organizationId, disabledAt: new Date() });
          await databaseBuilder.commit();

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(201);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When a membership is not disabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not be able to recreate it', async function () {
          // given
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          await databaseBuilder.commit();

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/memberships/{id}', function () {
    let options: $TSFixMe;
    let userId: $TSFixMe;
    let organizationId: $TSFixMe;
    let membershipId: $TSFixMe;
    let newOrganizationRole: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const externalId = 'externalId';
      organizationId = databaseBuilder.factory.buildOrganization({ externalId }).id;
      const adminUserId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: adminUserId,
        organizationRole: Membership.roles.ADMIN,
      });

      userId = databaseBuilder.factory.buildUser().id;
      membershipId = databaseBuilder.factory.buildMembership({
        organizationId,
        userId,
        organizationRole: Membership.roles.MEMBER,
      }).id;
      databaseBuilder.factory.buildCertificationCenter({ externalId });

      await databaseBuilder.commit();

      newOrganizationRole = Membership.roles.ADMIN;
      options = {
        method: 'PATCH',
        url: `/api/memberships/${membershipId}`,
        payload: {
          data: {
            id: membershipId.toString(),
            type: 'memberships',
            attributes: {
              'organization-role': newOrganizationRole,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: userId,
                },
              },
              organization: {
                data: {
                  type: 'organizations',
                  id: organizationId,
                },
              },
            },
          },
        },
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminUserId),
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('certification-center-memberships').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the updated membership and add certification center membership', async function () {
        // given
        const expectedMembership = {
          data: {
            type: 'memberships',
            id: membershipId.toString(),
            attributes: {
              'organization-role': newOrganizationRole,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: userId.toString(),
                },
              },
              organization: {
                data: {
                  type: 'organizations',
                  id: organizationId.toString(),
                },
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(_.omit(response.result, 'included')).to.deep.equal(expectedMembership);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 if user is not admin of membership organization', async function () {
        // given
        const notAdminUserId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildMembership({
          organizationId,
          userId: notAdminUserId,
          organizationRole: Membership.roles.MEMBER,
        });
        await databaseBuilder.commit();

        options.headers.authorization = generateValidRequestAuthorizationHeader(notAdminUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 if membership does not exist', async function () {
        // given
        options.url = '/api/memberships/NOT_NUMERIC';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
        const firstError = response.result.errors[0];
        expect(firstError.detail).to.equal('"id" must be a number');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/memberships/{id}/disable', function () {
    let options: $TSFixMe;
    let membershipId;
    let organizationId;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      const userId = databaseBuilder.factory.buildUser().id;
      membershipId = databaseBuilder.factory.buildMembership({ organizationId, userId }).id;
      const organizationAdminUserId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({
        userId: organizationAdminUserId,
        organizationId,
        organizationRole: Membership.roles.ADMIN,
      });

      await databaseBuilder.commit();

      options = {
        method: 'POST',
        url: `/api/memberships/${membershipId}/disable`,
        payload: {
          data: {
            id: membershipId.toString(),
            type: 'memberships',
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: userId,
                },
              },
              organization: {
                data: {
                  type: 'organizations',
                  id: organizationId,
                },
              },
            },
          },
        },
        headers: {
          authorization: generateValidRequestAuthorizationHeader(organizationAdminUserId),
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When user is admin of the organization', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 204', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 if user does not have the role Admin in organization', async function () {
        // given
        const notOrganizationAdminUserId = databaseBuilder.factory.buildUser().id;
        options.headers.authorization = generateValidRequestAuthorizationHeader(notOrganizationAdminUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 if membership does not exist', async function () {
        // given
        const unknownMembershipId = 9999;
        options.url = `/api/memberships/${unknownMembershipId}/disable`;

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
