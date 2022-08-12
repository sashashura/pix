// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cleanAnony... Remove this comment to see the full error message
  cleanAnonymizedAuthenticationMethods,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/clean-anonymized-users-authentication-methods');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | clean-anonymized-users-authentication-methods', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#cleanAnonymizedAuthenticationMethods', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should delete given user's authentication methods", async function () {
      // given
      databaseBuilder.factory.buildUser({ id: 1 });
      databaseBuilder.factory.buildUser({ id: 3 });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndPassword({ userId: 1 });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: 1 });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId: 3 });
      await databaseBuilder.commit();

      // when
      const arrayOfAnonymizedUsersIds = [1, 3];
      const anonymizedUserIdsWithAuthenticationMethodsDeleted = await cleanAnonymizedAuthenticationMethods({
        arrayOfAnonymizedUsersIds,
      });

      // then
      const authenticationMethodsForUsers1 = await knex('authentication-methods').where({ userId: 1 });
      expect(authenticationMethodsForUsers1.length).to.equal(0);

      const authenticationMethodsForUsers3 = await knex('authentication-methods').where({ userId: 3 });
      expect(authenticationMethodsForUsers3.length).to.equal(0);

      expect(anonymizedUserIdsWithAuthenticationMethodsDeleted).to.deep.equal(arrayOfAnonymizedUsersIds);
    });
  });
});
