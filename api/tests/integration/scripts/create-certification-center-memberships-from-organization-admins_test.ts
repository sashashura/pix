// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCertificationCenterMembership = require('../../../lib/infrastructure/orm-models/CertificationCenterMembership');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
  getCertificationCenterIdWithMembershipsUserIdByExternalId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAdminMe... Remove this comment to see the full error message
  getAdminMembershipsUserIdByOrganizationExternalId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchCerti... Remove this comment to see the full error message
  fetchCertificationCenterMembershipsByExternalId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
  prepareDataForInsert,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
  createCertificationCenterMemberships,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/create-certification-center-memberships-from-organization-admins');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | create-certification-center-memberships-from-organization-admins.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('certification-center-memberships').delete();
    await knex('certification-centers').delete();
    await knex('memberships').delete();
    await knex('organizations').delete();
    await knex('users').delete();
  });

  function _buildUserWithAdminMembership(organizationId: $TSFixMe) {
    const userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildMembership({
      organizationId,
      userId,
      organizationRole: Membership.roles.ADMIN,
    });
    return userId;
  }

  function _buildOrganizationAndAssociatedCertificationCenter(externalId: $TSFixMe) {
    const organization = databaseBuilder.factory.buildOrganization({ externalId });
    const certificationCenter = databaseBuilder.factory.buildCertificationCenter({ externalId });
    return { organization, certificationCenter };
  }

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificationCenterIdWithMembershipsUserIdByExternalId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification center has memberships', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should get certification center id with memberships user id by externalId', async function () {
        // given
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: certificationCenter.id,
          userId,
        });

        await databaseBuilder.commit();

        // when
        const result = await getCertificationCenterIdWithMembershipsUserIdByExternalId(certificationCenter.externalId);

        // then
        expect(result.id).to.equal(certificationCenter.id);
        expect(result.certificationCenterMemberships).to.deep.equal([userId]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification center does not have memberships', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should get certification center id with memberships user id by externalId', async function () {
        // given
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();

        await databaseBuilder.commit();

        // when
        const result = await getCertificationCenterIdWithMembershipsUserIdByExternalId(certificationCenter.externalId);

        // then
        expect(result.id).to.equal(certificationCenter.id);
        expect(result.certificationCenterMemberships).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAdminMembershipsUserIdByOrganizationExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get admin memberships by organization externalId', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const adminUserId1 = _buildUserWithAdminMembership(organization.id);
      const adminUserId2 = _buildUserWithAdminMembership(organization.id);
      await databaseBuilder.commit();

      // when
      const userIds = await getAdminMembershipsUserIdByOrganizationExternalId(organization.externalId);

      // then
      const expectedUserIds = [adminUserId1, adminUserId2];
      expect(userIds).to.have.deep.members(expectedUserIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array if organization has no admin membership', async function () {
      // given
      const externalId = '1212121A';
      databaseBuilder.factory.buildOrganization({ externalId });
      await databaseBuilder.commit();

      // when
      const memberships = await getAdminMembershipsUserIdByOrganizationExternalId(externalId);

      // then
      expect(memberships).to.have.lengthOf(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return anonymize user', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const anonymmizeUser = databaseBuilder.factory.buildUser({
        firstName: 'prenom_1234',
        lastName: 'nom_1234',
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization.id,
        userId: anonymmizeUser.id,
        organizationRole: Membership.roles.ADMIN,
      });

      const notAnonymizeUserId = databaseBuilder.factory.buildUser({
        firstName: 'pre_1234',
        lastName: 'no_1234',
      }).id;
      databaseBuilder.factory.buildMembership({
        organizationId: organization.id,
        userId: notAnonymizeUserId,
        organizationRole: Membership.roles.ADMIN,
      });

      await databaseBuilder.commit();

      // when
      const memberships = await getAdminMembershipsUserIdByOrganizationExternalId(organization.externalId);

      // then
      expect(memberships).to.deep.equal([notAnonymizeUserId]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return disabled member', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const disabledUser = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({
        organizationId: organization.id,
        userId: disabledUser.id,
        organizationRole: Membership.roles.ADMIN,
        disabledAt: '2020-02-04',
      });
      await databaseBuilder.commit();

      // when
      const memberships = await getAdminMembershipsUserIdByOrganizationExternalId(organization.externalId);

      // then
      expect(memberships).to.have.length(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fetchCertificationCenterMembershipsByExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch list of certification center memberships by externalId without already existing ones', async function () {
      // given
      const { organization, certificationCenter } = _buildOrganizationAndAssociatedCertificationCenter('ABC');
      const userId = _buildUserWithAdminMembership(organization.id);
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter.id,
        userId,
      });

      const newAdminUserId = _buildUserWithAdminMembership(organization.id);

      await databaseBuilder.commit();

      const expectedCertificationCenterMemberships = [
        { certificationCenterId: certificationCenter.id, userId: newAdminUserId },
      ];

      // when
      const result = await fetchCertificationCenterMembershipsByExternalId(certificationCenter.externalId);

      // then
      expect(result).to.deep.have.members(expectedCertificationCenterMemberships);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#prepareDataForInsert', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a list of certification center memberships to insert from a list of externalIds', async function () {
      // given
      const { organization: organization1, certificationCenter: certificationCenter1 } =
        _buildOrganizationAndAssociatedCertificationCenter('ABC');
      const adminUserId1 = _buildUserWithAdminMembership(organization1.id);
      const { organization: organization2, certificationCenter: certificationCenter2 } =
        _buildOrganizationAndAssociatedCertificationCenter('DEF');
      const adminUserId2 = _buildUserWithAdminMembership(organization2.id);
      const { organization: organization3, certificationCenter: certificationCenter3 } =
        _buildOrganizationAndAssociatedCertificationCenter('GHI');
      const adminUserId3a = _buildUserWithAdminMembership(organization3.id);
      const adminUserId3b = _buildUserWithAdminMembership(organization3.id);
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter3.id,
        userId: adminUserId3b,
      });

      await databaseBuilder.commit();

      // when
      const result = await prepareDataForInsert([
        { externalId: organization1.externalId },
        { externalId: organization2.externalId },
        { externalId: organization3.externalId },
      ]);

      // then
      const expectedCertificationCenterMemberships = [
        { certificationCenterId: certificationCenter1.id, userId: adminUserId1 },
        { certificationCenterId: certificationCenter2.id, userId: adminUserId2 },
        { certificationCenterId: certificationCenter3.id, userId: adminUserId3a },
      ];

      expect(result).to.deep.have.members(expectedCertificationCenterMemberships);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center has a membership already and organization has 2 to insert', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a list of 2 certification center memberships to insert from a list of externalIds', async function () {
        // given
        const { organization, certificationCenter: certificationCenterWithMembership } =
          _buildOrganizationAndAssociatedCertificationCenter('ABC');

        const adminUserId = _buildUserWithAdminMembership(organization.id);
        const adminUserBisId = _buildUserWithAdminMembership(organization.id);
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildMembership({
          userId,
          organizationId: organization.id,
          organizationRole: Membership.roles.MEMBER,
        });

        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: certificationCenterWithMembership.id,
          userId: adminUserId,
        });

        await databaseBuilder.commit();

        // when
        const result = await prepareDataForInsert([{ externalId: organization.externalId }]);

        // then
        const expectedCertificationCenterMemberships = [
          { certificationCenterId: certificationCenterWithMembership.id, userId: adminUserBisId },
        ];
        expect(result).to.deep.have.members(expectedCertificationCenterMemberships);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCertificationCenterMemberships', function () {
    const getNumberOfCertificationCenterMemberships = () => {
      return BookshelfCertificationCenterMembership.count().then((number: $TSFixMe) => parseInt(number, 10));
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center does not have any membership', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should insert 4 certification center memberships', async function () {
        // given
        const { organization: organization1, certificationCenter: certificationCenter1 } =
          _buildOrganizationAndAssociatedCertificationCenter('ABC');
        const adminUserId1a = _buildUserWithAdminMembership(organization1.id);
        const adminUserId1b = _buildUserWithAdminMembership(organization1.id);
        const { organization: organization2, certificationCenter: certificationCenter2 } =
          _buildOrganizationAndAssociatedCertificationCenter('DEF');
        const adminUserId2a = _buildUserWithAdminMembership(organization2.id);
        const adminUserId2b = _buildUserWithAdminMembership(organization2.id);

        const certificationCenterMemberships = [
          { certificationCenterId: certificationCenter1.id, userId: adminUserId1a },
          { certificationCenterId: certificationCenter1.id, userId: adminUserId1b },
          { certificationCenterId: certificationCenter2.id, userId: adminUserId2a },
          { certificationCenterId: certificationCenter2.id, userId: adminUserId2b },
        ];
        await databaseBuilder.commit();

        // when
        await createCertificationCenterMemberships(certificationCenterMemberships);
        const count = await getNumberOfCertificationCenterMemberships();

        // then
        expect(count).to.equal(4);
      });
    });
  });
});
