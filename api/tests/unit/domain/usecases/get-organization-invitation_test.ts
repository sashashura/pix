// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getOrganizationInvitation = require('../../../../lib/domain/usecases/get-organization-invitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingOrganizationInvitationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CancelledO... Remove this comment to see the full error message
  CancelledOrganizationInvitationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-organization-invitation', function () {
  let organizationInvitationRepository: $TSFixMe;
  let organizationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationInvitationRepository = {
      getByIdAndCode: sinon.stub(),
    };
    organizationRepository = {
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when invitation with id and code does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError', async function () {
      // given
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      organizationInvitationRepository.getByIdAndCode.rejects(new NotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getOrganizationInvitation)({
        organizationInvitationId: 1,
        code: 'codeNotExist',
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when organization with id does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError', async function () {
      // given
      const organizationInvitation = domainBuilder.buildOrganizationInvitation();
      organizationInvitationRepository.getByIdAndCode.resolves(organizationInvitation);
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      organizationRepository.get.rejects(new NotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getOrganizationInvitation)({
        organizationInvitationId: 1,
        code: 'codeNotExist',
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when invitation is already accepted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an AlreadyExistingOrganizationInvitationError', async function () {
      // given
      const status = OrganizationInvitation.StatusType.ACCEPTED;
      const organizationInvitation = domainBuilder.buildOrganizationInvitation({ status });
      organizationInvitationRepository.getByIdAndCode.resolves(organizationInvitation);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(getOrganizationInvitation)({
        organizationInvitationId: organizationInvitation.id,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(err).to.be.instanceOf(AlreadyExistingOrganizationInvitationError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when invitation is not accepted yet', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return found organization invitation', async function () {
      // given
      const organization = domainBuilder.buildOrganization();
      const organizationInvitationPending = domainBuilder.buildOrganizationInvitation({
        status: OrganizationInvitation.StatusType.PENDING,
        organizationId: organization.id,
        organizationName: null,
      });
      const expectedOrganizationInvitation = { ...organizationInvitationPending, organizationName: organization.name };

      const { id: organizationInvitationId, code: organizationInvitationCode } = organizationInvitationPending;
      organizationInvitationRepository.getByIdAndCode.resolves(organizationInvitationPending);
      organizationRepository.get.resolves(organization);

      // when
      const result = await getOrganizationInvitation({
        organizationInvitationId,
        organizationInvitationCode,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(result).to.deep.equal(expectedOrganizationInvitation);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when invitation is cancelled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an CancelledOrganizationInvitationError', async function () {
        // given
        const status = OrganizationInvitation.StatusType.CANCELLED;
        const organization = domainBuilder.buildOrganization();
        const organizationInvitation = domainBuilder.buildOrganizationInvitation({
          organizationId: organization.id,
          organizationName: organization.name,
          status,
        });
        organizationInvitationRepository.getByIdAndCode.resolves(organizationInvitation);
        organizationRepository.get.resolves(organization);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(getOrganizationInvitation)({
          organizationInvitationId: organizationInvitation.id,
          organizationRepository,
          organizationInvitationRepository,
        });

        // then
        expect(error).to.be.instanceOf(CancelledOrganizationInvitationError);
      });
    });
  });
});
