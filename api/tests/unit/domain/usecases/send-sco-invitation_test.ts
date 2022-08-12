// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationWithoutEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationArchivedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../../../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | send-sco-invitation', function () {
  let organizationRepository: $TSFixMe, organizationInvitationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationRepository = {
      findScoOrganizationsByUai: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call createScoOrganizationInvitation service', async function () {
    // given
    const firstName = 'Guy';
    const lastName = 'Tar';
    const locale = 'fr-fr';
    const uai = '1234567A';
    const organization = domainBuilder.buildOrganization({
      type: 'SCO',
      externalId: uai,
      archivedAt: null,
      email: 'sco.orga@example.net',
    });

    sinon.stub(organizationInvitationService, 'createScoOrganizationInvitation').resolves();
    organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization]);

    await usecases.sendScoInvitation({
      firstName,
      lastName,
      locale,
      uai,
      organizationRepository,
      organizationInvitationRepository,
    });

    expect(organizationInvitationService.createScoOrganizationInvitation).to.have.been.calledOnceWithExactly({
      organizationId: organization.id,
      firstName,
      lastName,
      email: organization.email,
      locale,
      organizationRepository,
      organizationInvitationRepository,
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('Error cases', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when uai did not match', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an NotFoundOrganizationError', async function () {
        // given
        const uai = '1234567A';
        domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([]);

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const requestErr = await catchErr(usecases.sendScoInvitation)({
          uai,
          organizationRepository,
        });

        expect(requestErr).to.be.instanceOf(OrganizationNotFoundError);
        expect((requestErr as $TSFixMe).message).to.be.equal("L'UAI/RNE 1234567A de l'établissement n’est pas reconnu.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when email is not present', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an OrganizationWithoutEmailError', async function () {
        // given
        const uai = '1234567A';
        const organization = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai, email: null });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization]);

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const requestErr = await catchErr(usecases.sendScoInvitation)({
          uai,
          organizationRepository,
        });

        expect(requestErr).to.be.instanceOf(OrganizationWithoutEmailError);
        expect((requestErr as $TSFixMe).message).to.be.equal("Nous n’avons pas d’adresse e-mail de contact associée à l'établissement concernant l'UAI/RNE 1234567A.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when many organizations found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a ManyOrganizationsFoundError', async function () {
        // given
        const uai = '1234567A';
        const organization1 = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });
        const organization2 = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization1, organization2]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const requestErr = await catchErr(usecases.sendScoInvitation)({
          uai,
          organizationRepository,
        });

        // then
        expect(requestErr).to.be.instanceOf(ManyOrganizationsFoundError);
        expect((requestErr as $TSFixMe).message).to.be.equal("Plusieurs établissements de type SCO ont été retrouvés pour L'UAI/RNE 1234567A.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization is archived', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a OrganizationArchivedError', async function () {
        // given
        const uai = '1234567A';
        const archivedOrganization = domainBuilder.buildOrganization({
          type: 'SCO',
          externalId: uai,
          archivedAt: '2022-02-02',
        });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([archivedOrganization]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const requestErr = await catchErr(usecases.sendScoInvitation)({
          uai,
          organizationRepository,
        });

        // then
        expect(requestErr).to.be.instanceOf(OrganizationArchivedError);
      });
    });
  });
});
