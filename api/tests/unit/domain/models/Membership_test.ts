// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
const { InvalidMembershipOrganizationRoleError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Membership', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validateRole', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organizationRole is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error', function () {
        // given / when
        const membership = new Membership({
          id: 'bbb12aa3',
          organizationRole: 'ADMIN',
        });

        // then
        expect(() => membership.validateRole()).not.to.throw();
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organizationRole is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an InvalidMembershipOrganizationRoleError error', async function () {
        // given / when
        const membership = new Membership({
          id: '123',
          organizationRole: 'SUPERADMIN',
        });

        // then
        expect(() => membership.validateRole()).to.throw(InvalidMembershipOrganizationRoleError);
      });
    });
  });
});
