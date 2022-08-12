// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipController = require('../../../../lib/application/memberships/membership-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../../../lib/infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | membership-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized created membership', async function () {
      // given
      const user = domainBuilder.buildUser();
      const organization = domainBuilder.buildOrganization();
      const membership = domainBuilder.buildMembership({ organization, user });
      const serializedMembership = Symbol('membership serialized');

      const request = {
        payload: {
          data: {
            relationships: {
              user: { data: { id: user.id } },
              organization: { data: { id: organization.id } },
            },
          },
        },
      };

      sinon
        .stub(usecases, 'createMembership')
        .withArgs({ userId: user.id, organizationId: organization.id })
        .resolves(membership);
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();
      sinon.stub(membershipSerializer, 'serialize').withArgs(membership).returns(serializedMembership);

      // when
      const result = await membershipController.create(request, hFake);

      // then
      expect(usecases.createMembership).to.have.been.calledOnce;
      expect(result.source).equal(serializedMembership);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call createCertificationCenterMembershipForScoOrganizationMember usecase', async function () {
      // given
      const user = domainBuilder.buildUser();
      const organization = domainBuilder.buildOrganization();
      const membership = domainBuilder.buildMembership({ organization, user });

      const request = {
        payload: {
          data: {
            relationships: {
              user: { data: { id: user.id } },
              organization: { data: { id: organization.id } },
            },
          },
        },
      };

      sinon
        .stub(usecases, 'createMembership')
        .withArgs({ userId: user.id, organizationId: organization.id })
        .resolves(membership);
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();

      // when
      await membershipController.create(request, hFake);

      // then
      expect(usecases.createCertificationCenterMembershipForScoOrganizationMember).calledWith({
        membership,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized updated membership', async function () {
      // given
      const user = domainBuilder.buildUser();
      const userWhoUpdateMemberRole = domainBuilder.buildUser();
      const organization = domainBuilder.buildOrganization();
      const membership = domainBuilder.buildMembership({
        organizationRole: Membership.roles.MEMBER,
        organization,
        user,
      });
      const updatedMembership = domainBuilder.buildMembership({
        organizationRole: Membership.roles.ADMIN,
        organization,
        user,
      });
      const serializedMembership = Symbol('membership serialized');

      const request = {
        params: {
          id: membership.id,
        },
        payload: {
          data: {
            type: 'memberships',
            id: membership.id,
            attributes: {
              'organization-role': Membership.roles.ADMIN,
            },
            relationships: {
              organization: {
                data: {
                  id: organization.id.toString(),
                  type: 'organizations',
                },
              },
            },
          },
        },
      };

      sinon.stub(requestResponseUtils, 'extractUserIdFromRequest').returns(userWhoUpdateMemberRole.id);
      sinon.stub(membershipSerializer, 'deserialize').withArgs(request.payload).returns(membership);
      sinon.stub(membershipSerializer, 'serialize').withArgs(updatedMembership).returns(serializedMembership);
      sinon
        .stub(usecases, 'updateMembership')
        .withArgs({
          membership,
        })
        .resolves(updatedMembership);
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();

      // when
      const result = await membershipController.update(request, hFake);

      // then
      expect(usecases.updateMembership).to.have.been.calledOnce;
      expect(result.source).equal(serializedMembership);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call createCertificationCenterMembershipForScoOrganizationMember usecase', async function () {
      // given
      const user = domainBuilder.buildUser();
      const userWhoUpdateMemberRole = domainBuilder.buildUser();
      const organization = domainBuilder.buildOrganization();
      const membership = domainBuilder.buildMembership({
        organizationRole: Membership.roles.MEMBER,
        organization,
        user,
      });
      const updatedMembership = domainBuilder.buildMembership({
        organizationRole: Membership.roles.ADMIN,
        organization,
        user,
      });

      const request = {
        params: {
          id: membership.id,
        },
        payload: {
          data: {
            type: 'memberships',
            id: membership.id,
            attributes: {
              'organization-role': Membership.roles.ADMIN,
            },
            relationships: {
              organization: {
                data: {
                  id: organization.id.toString(),
                  type: 'organizations',
                },
              },
            },
          },
        },
      };

      sinon.stub(requestResponseUtils, 'extractUserIdFromRequest').returns(userWhoUpdateMemberRole.id);
      sinon.stub(membershipSerializer, 'deserialize').withArgs(request.payload).returns(membership);
      sinon.stub(usecases, 'updateMembership').resolves(updatedMembership);
      sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember').resolves();

      // when
      await membershipController.update(request, hFake);

      // then
      expect(usecases.createCertificationCenterMembershipForScoOrganizationMember).calledWith({
        membership,
      });
    });
  });
});
