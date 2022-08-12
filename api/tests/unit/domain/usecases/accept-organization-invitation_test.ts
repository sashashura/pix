// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const acceptOrganizationInvitation = require('../../../../lib/domain/usecases/accept-organization-invitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitedUser = require('../../../../lib/domain/models/OrganizationInvitedUser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingMembershipError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | accept-organization-invitation', function () {
  let organizationInvitedUserRepository: $TSFixMe, organizationInvitationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationInvitedUserRepository = {
      get: sinon.stub(),
      save: sinon.stub(),
    };
    organizationInvitationRepository = {
      markAsAccepted: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user`s membership already exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should mark the invitation as accepted', async function () {
      // given
      const code = '123AZE';
      const email = 'user@example.net';
      const organization = domainBuilder.buildOrganization();
      const organizationInvitation = domainBuilder.buildOrganizationInvitation({
        organizationId: organization.id,
        code,
      });
      const user = domainBuilder.buildUser();
      const membership = domainBuilder.buildMembership({ user, organization, organizationRole: 'ADMIN' });

      const organizationInvitedUser = new OrganizationInvitedUser({
        userId: user.id,
        invitation: { code, id: organizationInvitation.id },
        currentRole: membership.organizationRole,
        status: organizationInvitation.status,
      });
      organizationInvitedUserRepository.get
        .withArgs({ organizationInvitationId: organizationInvitation.id, email })
        .resolves(organizationInvitedUser);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(acceptOrganizationInvitation)({
        organizationInvitationId: organizationInvitation.id,
        code,
        email,
        organizationInvitationRepository,
        organizationInvitedUserRepository,
      });

      // then
      expect(organizationInvitationRepository.markAsAccepted).to.have.been.calledWith(organizationInvitation.id);
      expect(error).to.be.instanceOf(AlreadyExistingMembershipError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the membership id and role', async function () {
    // given
    const code = '123AZE';
    const email = 'user@example.net';
    const organization = domainBuilder.buildOrganization();
    const organizationInvitationId = domainBuilder.buildOrganizationInvitation({
      organizationId: organization.id,
      code,
    }).id;
    const user = domainBuilder.buildUser();

    const organizationInvitedUser = new OrganizationInvitedUser({
      userId: user.id,
      invitation: { code, id: organizationInvitationId },
    });
    organizationInvitedUserRepository.get
      .withArgs({ organizationInvitationId, email })
      .resolves(organizationInvitedUser);

    sinon.stub(organizationInvitedUser, 'acceptInvitation').resolves();

    const membership = domainBuilder.buildMembership({ user, organization, organizationRole: 'MEMBER' });
    organizationInvitedUser.currentMembershipId = membership.id;
    organizationInvitedUser.currentRole = membership.organizationRole;

    // when
    const result = await acceptOrganizationInvitation({
      organizationInvitationId,
      code,
      email,
      organizationInvitationRepository,
      organizationInvitedUserRepository,
    });

    // then
    expect(organizationInvitedUserRepository.save).to.have.been.calledWith({ organizationInvitedUser });
    expect(result).to.deep.equal({
      id: organizationInvitedUser.currentMembershipId,
      isAdmin: false,
    });
  });
});
