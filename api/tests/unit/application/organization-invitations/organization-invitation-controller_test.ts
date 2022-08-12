// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
const { MissingQueryParamError } = require('../../../../lib/application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationController = require('../../../../lib/application/organization-invitations/organization-invitation-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-invitation-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Organization-Invitations | organization-invitation-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#acceptOrganizationInvitation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call acceptOrganizationInvitation usecase to accept invitation with organizationInvitationId and code', async function () {
      // given
      const code = 'ABCDEFGH01';
      const email = 'random@email.com';
      const organizationInvitation = domainBuilder.buildOrganizationInvitation({ code, email });
      const request = {
        params: { id: organizationInvitation.id },
        payload: {
          data: {
            type: 'organization-invitations',
            attributes: { code, email },
          },
        },
      };

      sinon.stub(usecases, 'acceptOrganizationInvitation').resolves();
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();

      // when
      await organizationInvitationController.acceptOrganizationInvitation(request);

      // then
      expect(usecases.acceptOrganizationInvitation).to.have.been.calledWith({
        organizationInvitationId: organizationInvitation.id,
        code,
        email,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call createCertificationCenterMembershipForScoOrganizationMember usecase to create certification center membership', async function () {
      // given
      const code = 'ABCDEFGH01';
      const email = 'random@email.com';
      const organizationInvitation = domainBuilder.buildOrganizationInvitation({ code, email });
      const membership = domainBuilder.buildMembership();
      const request = {
        params: { id: organizationInvitation.id },
        payload: {
          data: {
            type: 'organization-invitations',
            attributes: { code, email },
          },
        },
      };

      sinon.stub(usecases, 'acceptOrganizationInvitation').resolves(membership);
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();

      // when
      await organizationInvitationController.acceptOrganizationInvitation(request);

      // then
      expect(usecases.createCertificationCenterMembershipForScoOrganizationMember).to.have.been.calledWith({
        membership,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getOrganizationInvitation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the usecase to get invitation with organizationInvitationId, organizationInvitationCode', async function () {
      // given
      const organizationInvitationId = 1;
      const organizationInvitationCode = 'ABCDEFGH01';
      const request = {
        params: { id: organizationInvitationId },
        query: { code: organizationInvitationCode },
      };

      sinon.stub(usecases, 'getOrganizationInvitation').resolves();
      sinon.stub(organizationInvitationSerializer, 'serialize').returns();

      // when
      await organizationInvitationController.getOrganizationInvitation(request);

      // then
      expect(usecases.getOrganizationInvitation).to.have.been.calledWith({
        organizationInvitationId,
        organizationInvitationCode,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a MissingQueryParamError when code is not defined', async function () {
      // given
      const organizationInvitationId = 1;
      const request = {
        params: { id: organizationInvitationId },
        query: { code: undefined },
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const errorCatched = await catchErr(organizationInvitationController.getOrganizationInvitation)(request);

      // then
      expect(errorCatched).to.be.instanceof(MissingQueryParamError);
    });
  });
});
