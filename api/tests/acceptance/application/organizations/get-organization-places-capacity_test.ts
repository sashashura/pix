const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../../../../lib/domain/constants/organization-places-categories');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Organizations', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/organizations/{id}/places/capacity', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      // given
      const server = await createServer();

      const adminUser = await insertUserWithRoleSuperAdmin();
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      const options = {
        method: 'GET',
        url: `/api/admin/organizations/${organizationId}/places/capacity`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminUser.id),
        },
      };

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return list of places', async function () {
      // given
      const server = await createServer();

      const adminUser = await insertUserWithRoleSuperAdmin();
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildOrganizationPlace({
        organizationId,
        count: 10,
        category: categories.T0,
        createdBy: adminUser.id,
      });

      const options = {
        method: 'GET',
        url: `/api/admin/organizations/${organizationId}/places/capacity`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(adminUser.id),
        },
      };

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.result.data.attributes.categories[0].count).to.equal(10);
    });
  });
});
