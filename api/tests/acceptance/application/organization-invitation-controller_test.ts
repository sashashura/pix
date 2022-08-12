// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../lib/domain/models/OrganizationInvitation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | organization-invitation-controller', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('user-orga-settings').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organization-invitations/{id}/response', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      let organizationId;
      let options: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;
        const adminOrganizationUserId = databaseBuilder.factory.buildUser().id;

        databaseBuilder.factory.buildMembership({
          userId: adminOrganizationUserId,
          organizationId,
          organizationRole: Membership.roles.ADMIN,
        });

        const userToInviteEmail = databaseBuilder.factory.buildUser().email;
        const code = 'ABCDEFGH01';

        const organizationInvitationId = databaseBuilder.factory.buildOrganizationInvitation({
          organizationId,
          status: OrganizationInvitation.StatusType.PENDING,
          code: code,
        }).id;

        options = {
          method: 'POST',
          url: `/api/organization-invitations/${organizationInvitationId}/response`,
          payload: {
            data: {
              id: '100047_DZWMP7L5UM',
              type: 'organization-invitation-responses',
              attributes: {
                code,
                email: userToInviteEmail,
              },
            },
          },
        };

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('memberships').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 204 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('organization-invitations').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 404 if organization-invitation does not exist with id and code', async function () {
        // given
        const user = databaseBuilder.factory.buildUser({ email: 'user@example.net' });
        const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({});
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: `/api/organization-invitations/${organizationInvitation.id}/response`,
          payload: {
            data: {
              id: '100047_DZWMP7L5UM',
              type: 'organization-invitation-responses',
              attributes: {
                code: 'notExistCode',
                email: user.email,
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 409 if organization-invitation is already accepted', async function () {
        // given
        const user = databaseBuilder.factory.buildUser({ email: 'user@example.net' });
        const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
          status: OrganizationInvitation.StatusType.ACCEPTED,
          code: 'DEFRTG123',
        });

        const options = {
          method: 'POST',
          url: `/api/organization-invitations/${organizationInvitation.id}/response`,
          payload: {
            data: {
              id: '100047_DZWMP7L5UM',
              type: 'organization-invitation-responses',
              attributes: {
                code: organizationInvitation.code,
                email: user.email,
              },
            },
          },
        };

        await databaseBuilder.commit();

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(409);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 404 if given email is not linked to an existing user', async function () {
        // given
        const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
          status: OrganizationInvitation.StatusType.PENDING,
        });
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: `/api/organization-invitations/${organizationInvitation.id}/response`,
          payload: {
            data: {
              id: '100047_DZWMP7L5UM',
              type: 'organization-invitation-responses',
              attributes: {
                code: organizationInvitation.code,
                email: 'random@email.com',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 412 if membership already exist with userId and OrganizationId', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization();
        const { id: userId, email } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildMembership({ userId, organizationId: organization.id });
        const { id: organizationInvitationId, code } = databaseBuilder.factory.buildOrganizationInvitation({
          organizationId: organization.id,
          status: OrganizationInvitation.StatusType.PENDING,
        });
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: `/api/organization-invitations/${organizationInvitationId}/response`,
          payload: {
            data: {
              id: '100047_DZWMP7L5UM',
              type: 'organization-invitation-responses',
              attributes: {
                code: code,
                email: email,
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(412);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organization-invitations/{id}', function () {
    let organizationId;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        organizationId = databaseBuilder.factory.buildOrganization().id;

        const code = 'ABCDEFGH01';

        const organizationInvitationId = databaseBuilder.factory.buildOrganizationInvitation({
          organizationId,
          status: OrganizationInvitation.StatusType.PENDING,
          code,
        }).id;

        options = {
          method: 'GET',
          url: `/api/organization-invitations/${organizationInvitationId}?code=${code}`,
        };

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      let organizationInvitationId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const code = 'ABCDEFGH01';

        organizationId = databaseBuilder.factory.buildOrganization().id;
        organizationInvitationId = databaseBuilder.factory.buildOrganizationInvitation({
          organizationId,
          code,
        }).id;

        options = {
          method: 'GET',
          url: `/api/organization-invitations/${organizationInvitationId}?code=${code}`,
        };

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 - missing parameters if organization-invitation is requested without code', async function () {
        // given
        options.url = `/api/organization-invitations/${organizationInvitationId}`;

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 404 if organization-invitation is not found with given id and code', async function () {
        // given
        options.url = `/api/organization-invitations/${organizationInvitationId}?code=999`;

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 412 if organization-invitation is already accepted', async function () {
        // given
        const code = 'ABCDEFGH01';
        organizationId = databaseBuilder.factory.buildOrganization().id;
        organizationInvitationId = databaseBuilder.factory.buildOrganizationInvitation({
          organizationId,
          code,
          status: 'accepted',
        }).id;
        await databaseBuilder.commit();

        options.url = `/api/organization-invitations/${organizationInvitationId}?code=${code}`;

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(412);
      });
    });
  });
});
