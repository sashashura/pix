// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deactivateAdminMember = require('../../../../lib/domain/usecases/deactivate-admin-member');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | deactivate-admin-member', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should deactivate the given admin member and revoke all user's refresh tokens", async function () {
    // given
    const adminMemberRepository = { deactivate: sinon.stub(), getById: sinon.stub() };
    adminMemberRepository.deactivate.withArgs({ id: 7 }).resolves(undefined);
    adminMemberRepository.getById.withArgs(7).resolves({ userId: 2 });

    const refreshTokenService = { revokeRefreshTokensForUserId: sinon.stub() };

    // when
    const adminMember = await deactivateAdminMember({
      id: 7,
      adminMemberRepository,
      refreshTokenService,
    });

    // then
    expect(adminMember).to.be.undefined;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should revoke all user's refresh tokens", async function () {
    // given
    const adminMemberRepository = { deactivate: sinon.stub(), getById: sinon.stub() };
    adminMemberRepository.deactivate.withArgs({ id: 7 }).resolves(undefined);
    adminMemberRepository.getById.withArgs(7).resolves({ userId: 2 });
    const refreshTokenService = { revokeRefreshTokensForUserId: sinon.stub() };

    // when
    await deactivateAdminMember({
      id: 7,
      adminMemberRepository,
      refreshTokenService,
    });

    // then
    expect(refreshTokenService.revokeRefreshTokensForUserId).to.have.been.calledWithExactly({ userId: 2 });
  });
});
