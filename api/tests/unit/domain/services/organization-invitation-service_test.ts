// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../../../lib/domain/services/mail-service');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
  createOrganizationInvitation,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createScoO... Remove this comment to see the full error message
  createScoOrganizationInvitation,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createProO... Remove this comment to see the full error message
  createProOrganizationInvitation,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Organization-Invitation Service', function () {
  const userEmailAddress = 'user@example.net';
  const code = 'ABCDEFGH01';
  let organizationInvitationRepository: $TSFixMe;
  let organizationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationInvitationRepository = {
      create: sinon.stub(),
      findOnePendingByOrganizationIdAndEmail: sinon.stub(),
      updateModificationDate: sinon.stub(),
    };
    organizationRepository = {
      get: sinon.stub(),
    };
    sinon.stub(mailService, 'sendOrganizationInvitationEmail').resolves();
    sinon.stub(mailService, 'sendScoOrganizationInvitationEmail').resolves();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrganizationInvitation', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization-invitation does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a new organization-invitation and send an email with organizationId, email, code and locale', async function () {
        // given
        const role = null;
        const tags = undefined;
        const locale = 'fr-fr';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail
          .withArgs({ organizationId: organization.id, email: userEmailAddress })
          .resolves(null);
        organizationInvitationRepository.create.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          email: userEmailAddress,
          locale,
          role,
        });

        // then
        expect(organizationInvitationRepository.create).to.has.been.calledWith({
          organizationId: organization.id,
          email: userEmailAddress,
          code: sinon.match.string,
          role,
        });
        expect(mailService.sendOrganizationInvitationEmail).to.has.been.calledWith({
          email: userEmailAddress,
          organizationName: organization.name,
          organizationInvitationId: organizationInvitation.id,
          code,
          locale,
          tags,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an organization-invitation with pending status already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should re-send an email with same code', async function () {
        // given
        const tags = undefined;
        const locale = 'fr-fr';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          email: userEmailAddress,
          locale,
        });

        // then
        const expectedParameters = {
          email: userEmailAddress,
          organizationName: organization.name,
          organizationInvitationId: organizationInvitation.id,
          code,
          locale,
          tags,
        };

        expect(mailService.sendOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update organization-invitation modification date', async function () {
        // given
        const locale = 'fr-fr';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          email: userEmailAddress,
          locale,
        });

        // then
        expect(organizationInvitationRepository.updateModificationDate).to.have.been.calledWith(
          organizationInvitation.id
        );
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createScoOrganizationInvitation', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization-invitation does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a new organization-invitation and send an email with organizationId, email, firstName, lastName, code and locale', async function () {
        // given
        const tags = undefined;
        const locale = 'fr-fr';
        const firstName = 'john';
        const lastName = 'harry';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.ADMIN,
          status: 'pending',
          code,
        });
        organizationInvitationRepository.create
          .withArgs({
            organizationId: organization.id,
            email: userEmailAddress,
            code: sinon.match.string,
            role: organizationInvitation.role,
          })
          .resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createScoOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          firstName,
          lastName,
          email: userEmailAddress,
          locale,
        });

        // then
        const expectedParameters = {
          email: userEmailAddress,
          organizationName: organization.name,
          organizationInvitationId: organizationInvitation.id,
          firstName,
          lastName,
          code,
          locale,
          tags,
        };
        expect(mailService.sendScoOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should send an email with organizationId, email, code and tags', async function () {
        // given
        const tags = ['JOIN_ORGA'];
        const locale = 'fr-fr';
        const firstName = 'john';
        const lastName = 'harry';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.ADMIN,
          status: 'pending',
          code,
        });
        organizationInvitationRepository.create
          .withArgs({
            organizationId: organization.id,
            email: userEmailAddress,
            code: sinon.match.string,
            role: organizationInvitation.role,
          })
          .resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createScoOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          firstName,
          lastName,
          email: userEmailAddress,
          locale,
          tags,
        });

        // then
        const expectedParameters = {
          email: userEmailAddress,
          organizationName: organization.name,
          organizationInvitationId: organizationInvitation.id,
          firstName,
          lastName,
          code,
          locale,
          tags,
        };
        expect(mailService.sendScoOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an organization-invitation with pending status already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should re-send an email with same code', async function () {
        // given
        const tags = undefined;
        const locale = 'fr-fr';
        const firstName = 'john';
        const lastName = 'harry';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.ADMIN,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createScoOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          firstName,
          lastName,
          email: userEmailAddress,
          locale,
        });

        // then
        const expectedParameters = {
          email: userEmailAddress,
          organizationName: organization.name,
          organizationInvitationId: organizationInvitation.id,
          firstName,
          lastName,
          code,
          locale,
          tags,
        };

        expect(mailService.sendScoOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update organization-invitation modification date', async function () {
        // given
        const locale = 'fr-fr';
        const firstName = 'john';
        const lastName = 'harry';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.ADMIN,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        await createScoOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          firstName,
          lastName,
          email: userEmailAddress,
          locale,
        });

        // then
        expect(organizationInvitationRepository.updateModificationDate).to.have.been.calledWith(
          organizationInvitation.id
        );
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createProOrganizationInvitation', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization-invitation does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a new organization-invitation and send an email with organization id, name, email, code, locale and tags', async function () {
        // given
        const tags = ['JOIN_ORGA'];
        const locale = 'fr-fr';
        const role = Membership.roles.MEMBER;
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(null);
        organizationInvitationRepository.create
          .withArgs({
            organizationId: organization.id,
            email: userEmailAddress,
            role,
            code: sinon.match.string,
          })
          .resolves(organizationInvitation);

        const expectedParameters = {
          email: userEmailAddress,
          name: organization.name,
          organizationInvitationId: organizationInvitation.id,
          code,
          locale,
          tags,
        };

        // when
        await createProOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          name: organization.name,
          email: userEmailAddress,
          role,
          locale,
          tags,
        });

        // then
        expect(mailService.sendOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an organization-invitation with pending status already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should re-send an email with same code', async function () {
        // given
        const tags = undefined;
        const locale = 'fr-fr';
        const role = Membership.roles.MEMBER;
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);

        // when
        await createProOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          name: organization.name,
          email: userEmailAddress,
          role,
          locale,
          tags,
        });

        // then
        const expectedParameters = {
          email: userEmailAddress,
          name: organization.name,
          organizationInvitationId: organizationInvitation.id,
          code,
          locale,
          tags,
        };

        expect(mailService.sendOrganizationInvitationEmail).to.has.been.calledWith(expectedParameters);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update organization-invitation modification date', async function () {
        // given
        const tags = undefined;
        const locale = 'fr-fr';
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = new OrganizationInvitation({
          role: Membership.roles.MEMBER,
          status: 'pending',
          code,
        });

        organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail.resolves(organizationInvitation);

        // when
        await createProOrganizationInvitation({
          organizationRepository,
          organizationInvitationRepository,
          organizationId: organization.id,
          name: organization.name,
          email: userEmailAddress,
          locale,
          tags,
        });

        // then
        expect(organizationInvitationRepository.updateModificationDate).to.have.been.calledWith(
          organizationInvitation.id
        );
      });
    });
  });
});
