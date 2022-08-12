// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'saveAdminM... Remove this comment to see the full error message
const saveAdminMember = require('../../../../lib/domain/usecases/save-admin-member');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberRepository = require('../../../../lib/infrastructure/repositories/admin-member-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | save-admin-member', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when admin member exists and is disabled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reactivate admin member, update role if necessary, and return user details', async function () {
      // given
      const email = 'ice.bot@example.net';
      databaseBuilder.factory.buildUser.withRole({
        firstName: 'Sarah',
        lastName: 'Croche',
        email,
        disabledAt: new Date(),
      });
      await databaseBuilder.commit();

      // when
      const reactivatedAdminMember = await saveAdminMember({
        email,
        role: ROLES.SUPPORT,
        adminMemberRepository,
        userRepository,
      });

      // then
      expect(reactivatedAdminMember).to.contain({
        disabledAt: null,
        role: ROLES.SUPPORT,
        firstName: 'Sarah',
        lastName: 'Croche',
      });
    });
  });
});
