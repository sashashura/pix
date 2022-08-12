// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'markUsersR... Remove this comment to see the full error message
  markUsersRequiringTermsOfServiceValidationForRevalidation,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/mark-users-for-TermsOfService-revalidation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | mark-users-for-TermsOfService-revalidation_test', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#markUsersRequiringTermsOfServiceValidationForRevalidation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not revalidate terms of service if he did not validate them before', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ cgu: false }).id;
      await databaseBuilder.commit();

      // when
      const updatedUserIds = await markUsersRequiringTermsOfServiceValidationForRevalidation();

      // then
      expect(updatedUserIds).to.not.include(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should revalidate terms of service if he validated them before', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ cgu: true }).id;
      await databaseBuilder.commit();

      // when
      const updatedUserIds = await markUsersRequiringTermsOfServiceValidationForRevalidation();

      // then
      expect(updatedUserIds).to.include(userId);
    });
  });
});
