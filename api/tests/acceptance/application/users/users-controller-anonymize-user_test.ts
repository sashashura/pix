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

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-anonymize-user', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /admin/users/:id/anonymize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should anomymize user and remove authentication methods', async function () {
      // given
      const server = await createServer();
      const user = databaseBuilder.factory.buildUser.withRawPassword();
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'POST',
        url: `/api/admin/users/${user.id}/anonymize`,
        payload: {},
        headers: { authorization: generateValidRequestAuthorizationHeader(superAdmin.id) },
      };
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);

      const updatedUserAttributes = response.result.data.attributes;
      const updatedUserRelationships = response.result.data.relationships;
      expect(updatedUserAttributes['first-name']).to.equal(`prenom_${user.id}`);
      expect(updatedUserAttributes['last-name']).to.equal(`nom_${user.id}`);
      expect(updatedUserAttributes.email).to.equal(`email_${user.id}@example.net`);
      expect(updatedUserAttributes.username).to.be.null;

      expect(updatedUserRelationships['authentication-methods'].data).to.be.empty;
    });
  });
});
