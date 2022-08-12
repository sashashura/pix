// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../../../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createOrganizationInvitations = require('../../../../lib/domain/usecases/create-organization-invitations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationArchivedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-organization-invitations', function () {
  let organizationInvitationRepository: $TSFixMe, organizationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const organization = domainBuilder.buildOrganization();
    organizationRepository = {
      get: sinon.stub().resolves(organization),
    };
    sinon.stub(organizationInvitationService, 'createOrganizationInvitation').resolves();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrganizationInvitations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create one organization-invitation with organizationId and email', async function () {
      // given
      const organizationId = 1;
      const emails = ['member@organization.org'];
      const locale = 'fr-fr';

      // when
      await createOrganizationInvitations({
        organizationId,
        emails,
        locale,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(organizationInvitationService.createOrganizationInvitation).to.has.been.calledOnce;
      expect(organizationInvitationService.createOrganizationInvitation).to.has.been.calledWith({
        organizationId,
        email: emails[0],
        locale,
        organizationRepository,
        organizationInvitationRepository,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete spaces and duplicated emails, and create two organization-invitations', async function () {
      // given
      const organizationId = 2;
      const emails = ['member01@organization.org', '   member01@organization.org', 'member02@organization.org'];

      // when
      await createOrganizationInvitations({
        organizationId,
        emails,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(organizationInvitationService.createOrganizationInvitation).to.has.been.calledTwice;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an organization archived error when it is archived', async function () {
      // given
      const archivedOrganization = domainBuilder.buildOrganization({ archivedAt: '2022-02-02' });
      const emails = ['member01@organization.org'];
      organizationRepository.get.resolves(archivedOrganization);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganizationInvitations)({
        organizationId: archivedOrganization.id,
        emails,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(error).to.be.instanceOf(OrganizationArchivedError);
      expect((error as $TSFixMe).message).to.be.equal("L'organisation est archivée.");
      expect(organizationInvitationService.createOrganizationInvitation).to.not.have.been.called;
    });
  });
});
