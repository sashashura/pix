// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterRepository = require('../../../../lib/infrastructure/repositories/certification-center-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../../../lib/infrastructure/repositories/certification-center-membership-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
const createCertificationCenterMembershipForScoOrganizationMember = require('../../../../lib/domain/usecases/create-certification-center-membership-for-sco-organization-member');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-certification-center-membership-for-sco-organization-member', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('certification-center-memberships').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the organizationRole is ADMIN', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the SCO organization has a certification center', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('it should create a certification center membership', async function () {
        // given
        const externalId = 'foo';
        const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', externalId }).id;
        const userWhoseOrganizationRoleIsToUpdate = databaseBuilder.factory.buildUser();
        const adminWhoWantsToMakeTheOrganizationRoleChange = databaseBuilder.factory.buildUser();
        const membership = databaseBuilder.factory.buildMembership({
          organizationRole: Membership.roles.ADMIN,
          organizationId,
          userId: userWhoseOrganizationRoleIsToUpdate.id,
        });
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({ externalId }).id;
        await databaseBuilder.commit();

        const givenMembership = new Membership({
          id: membership.id,
          organizationRole: membership.organizationRole,
          updatedByUserId: adminWhoWantsToMakeTheOrganizationRoleChange.id,
        });

        // when
        await createCertificationCenterMembershipForScoOrganizationMember({
          membership: givenMembership,
          membershipRepository,
          certificationCenterRepository,
          certificationCenterMembershipRepository,
        });

        // then
        const certificationCenterMembership = await knex('certification-center-memberships')
          .where({
            userId: userWhoseOrganizationRoleIsToUpdate.id,
            certificationCenterId,
          })
          .first();

        expect(certificationCenterMembership).not.to.be.undefined;
        expect(certificationCenterMembership.userId).to.equal(userWhoseOrganizationRoleIsToUpdate.id);
        expect(certificationCenterMembership.certificationCenterId).to.equal(certificationCenterId);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the organizationRole is MEMBER', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('it should not create a certification center membership', async function () {
      // given
      const externalId = 'foo';
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO', externalId }).id;
      const userWhoseOrganizationRoleIsToUpdate = databaseBuilder.factory.buildUser();
      const adminWhoWantsToMakeTheOrganizationRoleChange = databaseBuilder.factory.buildUser();
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({ externalId }).id;
      const membership = databaseBuilder.factory.buildMembership({
        organizationRole: Membership.roles.MEMBER,
        organizationId,
        userId: userWhoseOrganizationRoleIsToUpdate.id,
      });
      await databaseBuilder.commit();

      const givenMembership = new Membership({
        id: membership.id,
        organizationRole: membership.organizationRole,
        updatedByUserId: adminWhoWantsToMakeTheOrganizationRoleChange.id,
      });

      // when
      await createCertificationCenterMembershipForScoOrganizationMember({
        membership: givenMembership,
        membershipRepository,
        certificationCenterRepository,
        certificationCenterMembershipRepository,
      });

      // then
      const certificationCenterMembership = await knex('certification-center-memberships')
        .where({
          userId: userWhoseOrganizationRoleIsToUpdate.id,
          certificationCenterId,
        })
        .first();

      expect(certificationCenterMembership).to.be.undefined;
    });
  });
});
