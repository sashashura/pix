// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader, knex } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | user-orga-settings-controller', function () {
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
  describe('PUT /api/user-orga-settings/{id}', function () {
    let userId: $TSFixMe;
    let expectedOrganizationId;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;

      const actualOrganizationId = databaseBuilder.factory.buildOrganization().id;
      expectedOrganizationId = databaseBuilder.factory.buildOrganization().id;

      databaseBuilder.factory.buildMembership({
        userId,
        organizationId: actualOrganizationId,
        organizationRole: 'MEMBER',
      });
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId: expectedOrganizationId,
        organizationRole: 'MEMBER',
      });

      databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: actualOrganizationId });

      await databaseBuilder.commit();

      options = {
        method: 'PUT',
        url: `/api/user-orga-settings/${userId}`,
        payload: {
          data: {
            relationships: {
              organization: {
                data: {
                  id: expectedOrganizationId,
                  type: 'organizations',
                },
              },
            },
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is not authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access', async function () {
        // given
        options.headers = { authorization: 'invalid.access.token' };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is authenticated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader(userId) };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update and return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When user is not member of organization', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 422 HTTP status code', async function () {
          // given
          options.payload.data.relationships.organization.data.id = 12345;

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(422);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When user is a disabled member of the organization', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 422 HTTP status code', async function () {
          // given
          expectedOrganizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({
            userId,
            organizationId: expectedOrganizationId,
            disabledAt: new Date(),
          });

          options.payload.data.relationships.organization.data.id = expectedOrganizationId;

          await databaseBuilder.commit();

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(422);
        });
      });
    });
  });
});
