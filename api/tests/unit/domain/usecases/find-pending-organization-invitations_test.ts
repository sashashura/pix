// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPendingOrganizationInvitations = require('../../../../lib/domain/usecases/find-pending-organization-invitations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-pending-organization-invitations', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should succeed', async function () {
    // given
    const organizationId = 1234;
    const organizationInvitationRepositoryStub = { findPendingByOrganizationId: sinon.stub() };
    organizationInvitationRepositoryStub.findPendingByOrganizationId.resolves();

    // when
    await findPendingOrganizationInvitations({
      organizationId,
      organizationInvitationRepository: organizationInvitationRepositoryStub,
    });

    // then
    expect(organizationInvitationRepositoryStub.findPendingByOrganizationId).to.have.been.calledWith({
      organizationId,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the OrganizationInvitations belonging to the given organization', async function () {
    // given
    const organizationId = 1234;
    const foundOrganizationInvitations = [
      domainBuilder.buildOrganizationInvitation({ organizationId, status: OrganizationInvitation.StatusType.PENDING }),
      domainBuilder.buildOrganizationInvitation({ organizationId, status: OrganizationInvitation.StatusType.PENDING }),
    ];
    const organizationInvitationRepositoryStub = {
      findPendingByOrganizationId: sinon.stub().resolves(foundOrganizationInvitations),
    };

    // when
    const organizationInvitations = await findPendingOrganizationInvitations({
      organizationId,
      organizationInvitationRepository: organizationInvitationRepositoryStub,
    });

    // then
    expect(organizationInvitations).to.deep.equal(foundOrganizationInvitations);
    expect(organizationInvitations[0]).to.be.an.instanceOf(OrganizationInvitation);
  });
});
