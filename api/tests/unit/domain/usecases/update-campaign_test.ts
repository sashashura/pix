// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateCampaign = require('../../../../lib/domain/usecases/update-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateResourceError, EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-campaign', function () {
  let originalCampaign: $TSFixMe;
  let userWithMembership: $TSFixMe;
  let ownerwithMembership;
  let campaignRepository: $TSFixMe, userRepository: $TSFixMe, membershipRepository: $TSFixMe;

  const organizationId = 1;
  const creatorId = 1;
  const ownerId = 2;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = { getWithMemberships: sinon.stub() };
    campaignRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };
    membershipRepository = { findByUserIdAndOrganizationId: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when campaign exists', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      originalCampaign = domainBuilder.buildCampaign({
        id: 1,
        name: 'Old name',
        title: 'Old title',
        type: 'ASSESSMENT',
        customLandingPageText: 'Old text',
        targetProfile: { id: 1 },
        creator: { id: creatorId },
        ownerId: domainBuilder.buildUser({ id: ownerId }).id,
        organization: { id: organizationId },
      });
      userWithMembership = {
        id: 1,
        memberships: [{ organization: { id: organizationId } }],
        hasAccessToOrganization: sinon.stub(),
      };
      ownerwithMembership = domainBuilder.buildMembership({
        user: domainBuilder.buildUser({ id: ownerId }),
        organization: { id: organizationId },
      });
      campaignRepository.get.withArgs(originalCampaign.id).resolves(originalCampaign);
      campaignRepository.update.callsFake((updatedCampaign: $TSFixMe) => updatedCampaign);
      userRepository.getWithMemberships.withArgs(userWithMembership.id).resolves(userWithMembership);
      userWithMembership.hasAccessToOrganization.withArgs(organizationId).returns(true);
      membershipRepository.findByUserIdAndOrganizationId
        .withArgs({ userId: ownerId, organizationId })
        .resolves([ownerwithMembership]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign title only', async function () {
      // given
      const updatedCampaign = domainBuilder.buildCampaign.ofTypeAssessment({
        ...originalCampaign,
        title: 'New title',
      });

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        title: updatedCampaign.title,
        ownerId,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(campaignRepository.update).to.have.been.calledWithExactly(updatedCampaign);
      expect(resultCampaign.title).to.equal(updatedCampaign.title);
      expect(resultCampaign.customLandingPageText).to.equal(originalCampaign.customLandingPageText);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign page text only', async function () {
      // given
      const updatedCampaign = domainBuilder.buildCampaign({
        ...originalCampaign,
        customLandingPageText: 'New text',
      });

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        ownerId,
        customLandingPageText: updatedCampaign.customLandingPageText,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(campaignRepository.update).to.have.been.calledWithExactly(updatedCampaign);
      expect(resultCampaign.title).to.equal(originalCampaign.title);
      expect(resultCampaign.customLandingPageText).to.equal(updatedCampaign.customLandingPageText);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign archive date only', async function () {
      // given
      const updatedCampaign = domainBuilder.buildCampaign({ ...originalCampaign });

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        ownerId,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(campaignRepository.update).to.have.been.calledWithExactly(updatedCampaign);
      expect(resultCampaign.title).to.equal(originalCampaign.title);
      expect(resultCampaign.customLandingPageText).to.equal(originalCampaign.customLandingPageText);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign name only', async function () {
      // given
      const updatedCampaign = domainBuilder.buildCampaign({
        ...originalCampaign,
        name: 'New Name',
      });

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        name: updatedCampaign.name,
        title: originalCampaign.title,
        ownerId,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(campaignRepository.update).to.have.been.calledWithExactly(updatedCampaign);
      expect(resultCampaign.name).to.equal(updatedCampaign.name);
      expect(resultCampaign.customLandingPageText).to.equal(originalCampaign.customLandingPageText);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign ownerId only', async function () {
      // given
      const newOwner = domainBuilder.buildUser({ id: 50 });
      const newOwnerWithMembership = domainBuilder.buildMembership({
        user: newOwner,
        organization: { id: organizationId },
      });
      const updatedCampaign = domainBuilder.buildCampaign({
        ...originalCampaign,
        ownerId: newOwner.id,
      });

      membershipRepository.findByUserIdAndOrganizationId.resolves([newOwnerWithMembership]);

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        name: originalCampaign.name,
        title: originalCampaign.title,
        ownerId: updatedCampaign.ownerId,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(resultCampaign.ownerId).to.equal(updatedCampaign.ownerId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update the campaign name if campaign name is undefined', async function () {
      // given
      const updatedCampaign = domainBuilder.buildCampaign({ ...originalCampaign });

      // when
      const resultCampaign = await updateCampaign({
        userId: userWithMembership.id,
        campaignId: updatedCampaign.id,
        name: undefined,
        title: originalCampaign.title,
        ownerId,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      expect(campaignRepository.update).to.have.been.calledWithExactly(updatedCampaign);
      expect(resultCampaign.name).to.equal(originalCampaign.name);
      expect(resultCampaign.customLandingPageText).to.equal(originalCampaign.customLandingPageText);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when an error occurred', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the user does not have an access to the campaign organization', async function () {
      // given
      const userWithoutMembership = {
        id: 1,
        hasAccessToOrganization: sinon.stub(),
      };
      originalCampaign = domainBuilder.buildCampaign({ organization: { id: organizationId } });

      campaignRepository.get.withArgs(originalCampaign.id).resolves(originalCampaign);
      userRepository.getWithMemberships.withArgs(userWithoutMembership.id).resolves(userWithoutMembership);
      userWithoutMembership.hasAccessToOrganization.withArgs(organizationId).returns(false);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateCampaign)({
        userId: userWithoutMembership.id,
        campaignId: originalCampaign.id,
        userRepository,
        campaignRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToUpdateResourceError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the owner is not a member of organization', async function () {
      // given
      const ownerWithoutMembership = domainBuilder.buildUser();
      userWithMembership = {
        id: 1,
        memberships: [{ organization: { id: organizationId } }],
        hasAccessToOrganization: sinon.stub(),
      };
      originalCampaign = domainBuilder.buildCampaign({ organization: { id: organizationId } });

      campaignRepository.get.withArgs(originalCampaign.id).resolves(originalCampaign);
      userRepository.getWithMemberships.withArgs(userWithMembership.id).resolves(userWithMembership);
      userWithMembership.hasAccessToOrganization.withArgs(organizationId).returns(true);
      membershipRepository.findByUserIdAndOrganizationId
        .withArgs({ userId: ownerWithoutMembership.id, organizationId })
        .resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateCampaign)({
        userId: userWithMembership.id,
        campaignId: originalCampaign.id,
        ownerId: ownerWithoutMembership.id,
        userRepository,
        campaignRepository,
        membershipRepository,
      });

      // then
      // then
      expect(error).to.be.instanceOf(EntityValidationError);
      expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'ownerId', message: 'OWNER_NOT_IN_ORGANIZATION' }]);
    });
  });
});
