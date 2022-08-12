// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
const { createCertificationCenterMembershipForScoOrganizationMember } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-certification-center-membership-for-sco-organization-member', function () {
  let membershipRepository: $TSFixMe;
  let certificationCenterRepository: $TSFixMe;
  let certificationCenterMembershipRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository = {
      get: sinon.stub(),
    };
    certificationCenterRepository = {
      findByExternalId: sinon.stub(),
    };
    certificationCenterMembershipRepository = {
      save: sinon.stub(),
      isMemberOfCertificationCenter: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organizationRole is ADMIN', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is SCO', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when the membership's organization has a certification center", function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the user is already a member of the certification center', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not create a certification center membership', async function () {
            // given
            const externalId = 'externalId';
            const organization = domainBuilder.buildOrganization({ externalId, type: 'SCO' });
            const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.ADMIN });
            const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
            const existingCertificationCenter = domainBuilder.buildCertificationCenter({ externalId });
            const existingMembership = domainBuilder.buildMembership({
              id: givenMembership.id,
              organizationRole: Membership.roles.MEMBER,
              organization,
              user: userWhoseOrganizationRoleIsToUpdate,
            });

            membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);
            certificationCenterRepository.findByExternalId
              .withArgs({ externalId })
              .resolves(existingCertificationCenter);
            certificationCenterMembershipRepository.isMemberOfCertificationCenter
              .withArgs({
                userId: userWhoseOrganizationRoleIsToUpdate.id,
                certificationCenterId: existingCertificationCenter.id,
              })
              .resolves(true);

            // when
            await createCertificationCenterMembershipForScoOrganizationMember({
              membership: givenMembership,
              membershipRepository,
              certificationCenterRepository,
              certificationCenterMembershipRepository,
            });

            // then
            expect(certificationCenterMembershipRepository.save).to.not.have.been.called;
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the user is not yet a member of the certification center', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should create a certification center membership', async function () {
            // given
            const externalId = 'externalId';
            const organization = domainBuilder.buildOrganization({ externalId, type: 'SCO' });
            const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.ADMIN });
            const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
            const existingCertificationCenter = domainBuilder.buildCertificationCenter({ externalId });
            const existingMembership = domainBuilder.buildMembership({
              id: givenMembership.id,
              organizationRole: Membership.roles.MEMBER,
              organization,
              user: userWhoseOrganizationRoleIsToUpdate,
            });

            membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);
            certificationCenterRepository.findByExternalId
              .withArgs({ externalId })
              .resolves(existingCertificationCenter);
            certificationCenterMembershipRepository.isMemberOfCertificationCenter
              .withArgs(userWhoseOrganizationRoleIsToUpdate.id, existingCertificationCenter.id)
              .resolves(false);

            // when
            await createCertificationCenterMembershipForScoOrganizationMember({
              membership: givenMembership,
              membershipRepository,
              certificationCenterRepository,
              certificationCenterMembershipRepository,
            });

            // then
            expect(certificationCenterMembershipRepository.save).to.have.been.calledWith({
              userId: userWhoseOrganizationRoleIsToUpdate.id,
              certificationCenterId: existingCertificationCenter.id,
            });
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when the membership's organization has no certification center", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not create a certification center membership', async function () {
          // given
          const externalId = 'externalId';
          const organization = domainBuilder.buildOrganization({ externalId, type: 'SCO' });
          const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.ADMIN });
          const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
          const existingMembership = domainBuilder.buildMembership({
            id: givenMembership.id,
            organizationRole: Membership.roles.MEMBER,
            organization,
            user: userWhoseOrganizationRoleIsToUpdate,
          });

          membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);
          certificationCenterRepository.findByExternalId.withArgs({ externalId }).resolves(null);

          // when
          await createCertificationCenterMembershipForScoOrganizationMember({
            membership: givenMembership,
            membershipRepository,
            certificationCenterRepository,
            certificationCenterMembershipRepository,
          });

          // then
          expect(certificationCenterMembershipRepository.isMemberOfCertificationCenter).to.not.have.been.called;
          expect(certificationCenterMembershipRepository.save).to.not.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is not SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create a certification center membership', async function () {
        // given
        const externalId = 'externalId';
        const organization = domainBuilder.buildOrganization({ externalId, type: 'SUP' });
        const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.ADMIN });
        const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
        const existingMembership = domainBuilder.buildMembership({
          id: givenMembership.id,
          organizationRole: Membership.roles.MEMBER,
          organization,
          user: userWhoseOrganizationRoleIsToUpdate,
        });

        membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);

        // when
        await createCertificationCenterMembershipForScoOrganizationMember({
          membership: givenMembership,
          membershipRepository,
          certificationCenterRepository,
          certificationCenterMembershipRepository,
        });

        // then
        expect(certificationCenterRepository.findByExternalId).to.not.have.been.called;
        expect(certificationCenterMembershipRepository.isMemberOfCertificationCenter).to.not.have.been.called;
        expect(certificationCenterMembershipRepository.save).to.not.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization has no external id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create a certification center membership', async function () {
        // given
        const organization = domainBuilder.buildOrganization({ externalId: null, type: 'SCO' });
        const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.ADMIN });
        const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
        const existingMembership = domainBuilder.buildMembership({
          id: givenMembership.id,
          organizationRole: Membership.roles.MEMBER,
          organization,
          user: userWhoseOrganizationRoleIsToUpdate,
        });

        membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);

        // when
        await createCertificationCenterMembershipForScoOrganizationMember({
          membership: givenMembership,
          membershipRepository,
          certificationCenterRepository,
          certificationCenterMembershipRepository,
        });

        // then
        expect(certificationCenterRepository.findByExternalId).to.not.have.been.called;
        expect(certificationCenterMembershipRepository.isMemberOfCertificationCenter).to.not.have.been.called;
        expect(certificationCenterMembershipRepository.save).to.not.have.been.called;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organizationRole is MEMBER', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not create a certification center membership', async function () {
      // given
      const externalId = 'externalId';
      const organization = domainBuilder.buildOrganization({ externalId, type: 'SCO' });
      const givenMembership = new Membership({ id: 1, organizationRole: Membership.roles.MEMBER });
      const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
      const existingMembership = domainBuilder.buildMembership({
        id: givenMembership.id,
        organizationRole: Membership.roles.MEMBER,
        organization,
        user: userWhoseOrganizationRoleIsToUpdate,
      });

      membershipRepository.get.withArgs(givenMembership.id).resolves(existingMembership);

      // when
      await createCertificationCenterMembershipForScoOrganizationMember({
        membership: givenMembership,
        membershipRepository,
        certificationCenterRepository,
        certificationCenterMembershipRepository,
      });

      // then
      expect(certificationCenterRepository.findByExternalId).to.not.have.been.called;
      expect(certificationCenterMembershipRepository.isMemberOfCertificationCenter).to.not.have.been.called;
      expect(certificationCenterMembershipRepository.save).to.not.have.been.called;
    });
  });
});
