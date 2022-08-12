const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Target-profiles', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/admin/target-profiles/{id}/simplified-access', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      // given
      const server = await createServer();

      const superAdmin = await insertUserWithRoleSuperAdmin();
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ isSimplifiedAccess: false });
      await databaseBuilder.commit();

      const options = {
        method: 'PUT',
        url: `/api/admin/target-profiles/${targetProfile.id}/simplified-access`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.payload).to.equal(
        JSON.stringify({
          data: {
            type: 'target-profiles',
            id: targetProfile.id.toString(),
            attributes: { 'is-simplified-access': true },
          },
        })
      );
    });
  });
});
