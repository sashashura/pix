// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateMemb... Remove this comment to see the full error message
const { updateMembership } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
const { InvalidMembershipOrganizationRoleError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-membership', function () {
  let membershipRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository = {
      updateById: sinon.stub(),
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a InvalidMembershipOrganizationRoleError if role is not valid', async function () {
    // given
    const membershipId = 100;
    const organizationRole = 'NOT_VALID_ROLE';
    const membership = new Membership({ id: membershipId, organizationRole });

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateMembership)({
      membership,
      membershipRepository,
    });

    // then
    expect(error).to.an.instanceOf(InvalidMembershipOrganizationRoleError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update the membership', async function () {
    // given
    const organization = domainBuilder.buildOrganization({ type: 'SUP' });
    const membershipId = 100;
    const givenMembership = new Membership({
      id: membershipId,
      organizationRole: Membership.roles.MEMBER,
      updatedByUserId: 123,
    });
    const userWhoseOrganizationRoleIsToUpdate = domainBuilder.buildUser();
    const existingMembership = domainBuilder.buildMembership({
      id: membershipId,
      organizationRole: Membership.roles.ADMIN,
      organization,
      user: userWhoseOrganizationRoleIsToUpdate,
    });
    const membershipWithRelatedUserAndOrganization = Symbol('a membership with related informations');
    membershipRepository.get.withArgs(membershipId).resolves(existingMembership);
    membershipRepository.updateById
      .withArgs({ id: membershipId, membership: givenMembership })
      .resolves(membershipWithRelatedUserAndOrganization);

    // when
    const result = await updateMembership({
      membership: givenMembership,
      membershipRepository,
    });

    // then
    expect(result).to.equal(membershipWithRelatedUserAndOrganization);
  });
});
