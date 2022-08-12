// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, UncancellableOrganizationInvitationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cancelOrganizationInvitation = require('../../../../lib/domain/usecases/cancel-organization-invitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | cancel-organization-invitation', function () {
  let organizationInvitationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationInvitationRepository = {
      get: sinon.stub(),
      markAsCancelled: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context("when invitation doesn't exist", function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      organizationInvitationRepository.get.rejects(new NotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(cancelOrganizationInvitation)({
        organizationInvitationRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when invitation exist ', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when invitation is not pending', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an uncancellable organization invitation error', async function () {
        // given
        const status = OrganizationInvitation.StatusType.ACCEPTED;
        const organizationInvitation = domainBuilder.buildOrganizationInvitation({ status });

        organizationInvitationRepository.get.resolves(organizationInvitation);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(cancelOrganizationInvitation)({
          organizationInvitationRepository,
        });

        // then
        expect(error).to.be.instanceOf(UncancellableOrganizationInvitationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when invitation is pending', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the cancelled organization invitation', async function () {
        // given
        const status = OrganizationInvitation.StatusType.PENDING;
        const organizationInvitation = domainBuilder.buildOrganizationInvitation({ status });
        const organizationInvitationId = organizationInvitation.id;
        const cancelledOrganizationInvitation = Symbol('the cancelled invitation');

        organizationInvitationRepository.get.resolves(organizationInvitation);
        organizationInvitationRepository.markAsCancelled
          .withArgs({
            id: organizationInvitationId,
          })
          .resolves(cancelledOrganizationInvitation);

        // when
        const result = await cancelOrganizationInvitation({
          organizationInvitationId,
          organizationInvitationRepository,
        });

        // then
        expect(result).to.be.equal(cancelledOrganizationInvitation);
      });
    });
  });
});
