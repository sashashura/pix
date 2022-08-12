// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../../../lib/domain/services/organization-invitation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createOrganizationInvitationByAdmin = require('../../../../lib/domain/usecases/create-organization-invitation-by-admin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationArchivedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-organization-invitation-by-admin', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrganizationInvitationByAdmin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create one organization-invitation with organizationId, role and email', async function () {
      // given
      const organization = domainBuilder.buildOrganization();
      const email = 'member@organization.org';
      const locale = 'fr-fr';
      const role = Membership.roles.MEMBER;

      const organizationInvitationRepository = sinon.stub();
      const organizationRepository = { get: sinon.stub().resolves(organization) };
      sinon.stub(organizationInvitationService, 'createOrganizationInvitation').resolves();

      // when
      await createOrganizationInvitationByAdmin({
        organizationId: organization.id,
        email,
        locale,
        role,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(organizationInvitationService.createOrganizationInvitation).to.has.been.calledOnce;
      expect(organizationInvitationService.createOrganizationInvitation).to.has.been.calledWith({
        organizationId: organization.id,
        email,
        locale,
        role,
        organizationRepository,
        organizationInvitationRepository,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an organization archived error when it is archived', async function () {
      // given
      const archivedOrganization = domainBuilder.buildOrganization({ archivedAt: '2022-02-02' });
      const emails = ['member01@organization.org'];
      const locale = 'fr-fr';
      const role = Membership.roles.MEMBER;

      const organizationInvitationRepository = sinon.stub();
      const organizationRepository = {
        get: sinon.stub().resolves(archivedOrganization),
      };
      sinon.stub(organizationInvitationService, 'createOrganizationInvitation').resolves();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganizationInvitationByAdmin)({
        organizationId: archivedOrganization.id,
        emails,
        locale,
        role,
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
