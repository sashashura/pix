// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitedUser = require('../../../../lib/domain/models/OrganizationInvitedUser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingMembershipError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyAcc... Remove this comment to see the full error message
  AlreadyAcceptedOrCancelledOrganizationInvitationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | OrganizationInvitedUser', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#acceptInvitation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When organization code is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const code = '1234AZE';
          const invitedUser = new OrganizationInvitedUser({
            userId: domainBuilder.buildUser().id,
            invitation: {
              code: '5678BFR',
            },
            currentRole: null,
            organizationHasMemberships: 2,
            currentMembershipId: null,
            status: 'pending',
          });

          // when
          const error = await catchErr(invitedUser.acceptInvitation, invitedUser)({ code });

          // then
          expect(error).to.be.an.instanceof(NotFoundError);
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When membership already exist and invitation does not has role', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const code = '1234AZE';
          const invitedUser = new OrganizationInvitedUser({
            userId: domainBuilder.buildUser().id,
            invitation: {
              code: '1234AZE',
              role: null,
            },
            currentRole: 'MEMBER',
            organizationHasMemberships: 2,
            currentMembershipId: domainBuilder.buildMembership().id,
            status: 'pending',
          });

          // when
          const error = await catchErr(invitedUser.acceptInvitation, invitedUser)({ code });

          // then
          expect(error).to.be.an.instanceof(AlreadyExistingMembershipError);
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When invitation is accepted or cancelled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const code = '1234AZE';
          const invitedUser = new OrganizationInvitedUser({
            userId: domainBuilder.buildUser().id,
            invitation: {
              code: '1234AZE',
              role: null,
            },
            currentRole: 'MEMBER',
            organizationHasMemberships: 2,
            currentMembershipId: domainBuilder.buildMembership().id,
            status: 'accepted',
          });

          // when
          const error = await catchErr(invitedUser.acceptInvitation, invitedUser)({ code });

          // then
          expect(error).to.be.an.instanceof(AlreadyAcceptedOrCancelledOrganizationInvitationError);
          expect((error as $TSFixMe).message).to.equal("L'invitation à rejoindre l'organisation a déjà été acceptée ou annulée.");
        });
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When invitation has role', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should become member current role', async function () {
          // given
          const code = '1234AZE';
          const invitedUser = new OrganizationInvitedUser({
            userId: domainBuilder.buildUser().id,
            invitation: {
              code,
              role: 'ADMIN',
            },
            currentRole: null,
            organizationHasMemberships: 2,
            currentMembershipId: null,
            status: 'pending',
          });

          // when
          invitedUser.acceptInvitation({ code });

          // then
          expect(invitedUser.currentRole).to.equal('ADMIN');
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When invitation does not has role', function () {
        // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
        describe('When organization has memberships', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should fill the current role with "MEMBER"', async function () {
            // given
            const code = '1234AZE';
            const invitedUser = new OrganizationInvitedUser({
              userId: domainBuilder.buildUser().id,
              invitation: {
                code,
                role: null,
              },
              currentRole: null,
              organizationHasMemberships: 2,
              currentMembershipId: null,
              status: 'pending',
            });

            // when
            invitedUser.acceptInvitation({ code });

            // then
            expect(invitedUser.currentRole).to.equal('MEMBER');
          });
        });
        // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
        describe('When organization has not memberships', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should fill the current role with "ADMIN"', async function () {
            // given
            const code = '1234AZE';
            const invitedUser = new OrganizationInvitedUser({
              userId: domainBuilder.buildUser().id,
              invitation: {
                code,
                role: null,
              },
              currentRole: null,
              organizationHasMemberships: 0,
              currentMembershipId: null,
              status: 'pending',
            });

            // when
            invitedUser.acceptInvitation({ code });

            // then
            expect(invitedUser.currentRole).to.equal('ADMIN');
          });
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should mark invitation as accepted', async function () {
        // given
        const code = '1234AZE';
        const invitedUser = new OrganizationInvitedUser({
          userId: domainBuilder.buildUser().id,
          invitation: {
            code,
            role: null,
          },
          currentRole: null,
          organizationHasMemberships: 2,
          currentMembershipId: null,
          status: 'pending',
        });

        // when
        invitedUser.acceptInvitation({ code });

        // then
        expect(invitedUser.status).to.equal('accepted');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isPending', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if current membership id exist', function () {
      // given
      const invitedUser = new OrganizationInvitedUser({
        userId: domainBuilder.buildUser().id,
        invitation: {
          code: 'ZERRTTYG',
          role: null,
        },
        currentRole: 'ADMIN',
        organizationHasMemberships: 2,
        currentMembershipId: domainBuilder.buildMembership().id,
        status: 'pending',
      });

      // when
      const result = invitedUser.isAlreadyMemberOfOrganization;

      // /then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if current membership id does not exist', function () {
      // given
      const invitedUser = new OrganizationInvitedUser({
        userId: domainBuilder.buildUser().id,
        invitation: {
          code: 'ZERRTTYG',
          role: null,
        },
        currentRole: null,
        organizationHasMemberships: 2,
        currentMembershipId: null,
        status: 'pending',
      });

      // when
      const result = invitedUser.isAlreadyMemberOfOrganization;

      // /then
      expect(result).to.be.false;
    });
  });
});
