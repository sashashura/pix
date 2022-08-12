// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { disableMembership } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const { MembershipUpdateError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | disable-membership', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(membershipRepository, 'updateById');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should disable membership', async function () {
    // given
    const membershipId = 100;
    const userId = 10;
    membershipRepository.updateById.resolves();

    // when
    await disableMembership({ membershipId, userId, membershipRepository });

    // then
    const expectedMembershipAttributes = {
      disabledAt: sinon.match.instanceOf(Date),
      updatedByUserId: userId,
    };
    expect(membershipRepository.updateById).to.has.been.calledWithExactly({
      id: membershipId,
      membership: expectedMembershipAttributes,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a MembershipUpdateError if membership does not exist', async function () {
    // given
    const membershipId = 99999999;
    const userId = 10;
    membershipRepository.updateById.throws(new MembershipUpdateError());

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(disableMembership)({ membershipId, userId, membershipRepository });

    // then
    expect(error).to.be.instanceOf(MembershipUpdateError);
  });
});
