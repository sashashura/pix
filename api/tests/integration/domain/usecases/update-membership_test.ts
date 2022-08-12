// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateMemb... Remove this comment to see the full error message
const updateMembership = require('../../../../lib/domain/usecases/update-membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | update-membership', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update membership', async function () {
    // given
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const updatedByUserId = databaseBuilder.factory.buildUser().id;

    const membershipId = databaseBuilder.factory.buildMembership({
      organizationId,
      userId,
      organizationRole: Membership.roles.MEMBER,
    }).id;

    await databaseBuilder.commit();

    const newOrganizationRole = Membership.roles.ADMIN;
    const membership = new Membership({ id: membershipId, organizationRole: newOrganizationRole, updatedByUserId });

    // when
    const result = await updateMembership({
      membership,
      membershipRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Membership);
    expect(result.organizationRole).equal(newOrganizationRole);
    expect(result.updatedByUserId).equal(updatedByUserId);
  });
});
