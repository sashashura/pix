// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationMemberIdentity = require('../../../../lib/domain/models/OrganizationMemberIdentity');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationMemberIdentityRepository = require('../../../../lib/infrastructure/repositories/organization-member-identity-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | organizationMemberIdentityRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAllByOrganizationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only actives members identities', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const activeMemberId = databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Némard' }).id;
      const disabledMemberId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ organizationId, userId: activeMemberId });
      databaseBuilder.factory.buildMembership({ organizationId, userId: disabledMemberId, disabledAt: new Date() });
      await databaseBuilder.commit();

      // when
      const members = await organizationMemberIdentityRepository.findAllByOrganizationId({ organizationId });

      // then
      expect(members).to.have.lengthOf(1);
      expect(members[0]).to.be.an.instanceof(OrganizationMemberIdentity);
      expect(members[0].id).to.equal(activeMemberId);
      expect(members[0].firstName).to.equal('Jean');
      expect(members[0].lastName).to.equal('Némard');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only members of the organization', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const activeMemberId = databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Némard' }).id;
      const memberOfAnotherOrganization = databaseBuilder.factory.buildUser({
        firstName: 'Jean',
        lastName: 'Tanrien',
      }).id;

      databaseBuilder.factory.buildMembership({ organizationId, userId: activeMemberId });
      databaseBuilder.factory.buildMembership({
        organizationId: otherOrganizationId,
        userId: memberOfAnotherOrganization,
      });
      await databaseBuilder.commit();

      // when
      const members = await organizationMemberIdentityRepository.findAllByOrganizationId({ organizationId });

      // then
      expect(members).to.have.lengthOf(1);
      expect(members[0].id).to.deep.equal(activeMemberId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return members sorted by firstName and lastName', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const activeMemberId = databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Némard' }).id;
      const otherActiveMemberId = databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Registre' }).id;
      const otherActiveMemberId2 = databaseBuilder.factory.buildUser({ firstName: 'Anne', lastName: 'Registre' }).id;
      const otherActiveMemberId3 = databaseBuilder.factory.buildUser({ firstName: 'anne', lastName: 'atole' }).id;

      databaseBuilder.factory.buildMembership({ organizationId, userId: activeMemberId });
      databaseBuilder.factory.buildMembership({ organizationId, userId: otherActiveMemberId });
      databaseBuilder.factory.buildMembership({ organizationId, userId: otherActiveMemberId2 });
      databaseBuilder.factory.buildMembership({ organizationId, userId: otherActiveMemberId3 });
      await databaseBuilder.commit();

      // when
      const members = await organizationMemberIdentityRepository.findAllByOrganizationId({ organizationId });

      // then
      const expectedMember1 = new OrganizationMemberIdentity({
        id: otherActiveMemberId3,
        firstName: 'anne',
        lastName: 'atole',
      });
      const expectedMember2 = new OrganizationMemberIdentity({
        id: otherActiveMemberId2,
        firstName: 'Anne',
        lastName: 'Registre',
      });
      const expectedMember3 = new OrganizationMemberIdentity({
        id: activeMemberId,
        firstName: 'Jean',
        lastName: 'Némard',
      });
      const expectedMember4 = new OrganizationMemberIdentity({
        id: otherActiveMemberId,
        firstName: 'Jean',
        lastName: 'Registre',
      });

      expect(members[0]).to.deep.equal(expectedMember1);
      expect(members[1]).to.deep.equal(expectedMember2);
      expect(members[2]).to.deep.equal(expectedMember3);
      expect(members[3]).to.deep.equal(expectedMember4);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array if organization has no members', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      // when
      const result = await organizationMemberIdentityRepository.findAllByOrganizationId({
        organizationId,
      });

      // then
      expect(result).to.be.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array if organization does not exists', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const wrongOrganizationId = organizationId + 1;
      await databaseBuilder.commit();

      // when
      const result = await organizationMemberIdentityRepository.findAllByOrganizationId({
        organizationId: wrongOrganizationId,
      });

      // then
      expect(result).to.be.deep.equal([]);
    });
  });
});
