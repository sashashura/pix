// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToAccessEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerDisabledError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-association-between-user-and-organization-learner', function () {
  let organizationLearnerReceivedStub: $TSFixMe;
  let getCampaignStub: $TSFixMe;
  let organizationLearner: $TSFixMe;
  let organization: $TSFixMe;
  let userId: $TSFixMe;
  let campaign: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userId = domainBuilder.buildUser().id;
    organization = domainBuilder.buildOrganization();
    campaign = domainBuilder.buildCampaign({ organization });
    organizationLearner = domainBuilder.buildOrganizationLearner({ organization, userId });
    getCampaignStub = sinon.stub(campaignRepository, 'getByCode').throws('unexpected call');
    organizationLearnerReceivedStub = sinon
      .stub(organizationLearnerRepository, 'findOneByUserIdAndOrganizationId')
      .throws('unexpected call');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('There is an organizationLearner linked to the given userId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call findOneByUserIdAndOrganizationId', async function () {
      // given
      getCampaignStub.withArgs(campaign.code).resolves(campaign);
      organizationLearnerReceivedStub.resolves({});

      // when
      await usecases.findAssociationBetweenUserAndOrganizationLearner({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(organizationLearnerReceivedStub).to.have.been.calledOnce;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the OrganizationLearner', async function () {
      // given
      getCampaignStub.withArgs(campaign.code).resolves(campaign);
      organizationLearnerReceivedStub
        .withArgs({ userId, organizationId: organization.id })
        .resolves(organizationLearner);

      // when
      const result = await usecases.findAssociationBetweenUserAndOrganizationLearner({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.be.deep.equal(organizationLearner);
      expect(result).to.be.instanceof(OrganizationLearner);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('There is no organizationLearner linked to the given userId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null', async function () {
      // given
      getCampaignStub.withArgs(campaign.code).resolves(campaign);
      organizationLearnerReceivedStub.withArgs({ userId, organizationId: organization.id }).resolves(null);

      // when
      const result = await usecases.findAssociationBetweenUserAndOrganizationLearner({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('There is no organizationLearner linked to the organization owning the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null', async function () {
      // given
      const otherCampaign = domainBuilder.buildCampaign();
      getCampaignStub.withArgs(campaign.code).resolves(otherCampaign);
      organizationLearnerReceivedStub.withArgs({ userId, organizationId: otherCampaign.organizationId }).resolves(null);

      // when
      const result = await usecases.findAssociationBetweenUserAndOrganizationLearner({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('There is a disabled organizationLearner linked to the given userId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      const disabledOrganizationLearner = domainBuilder.buildOrganizationLearner({
        organization,
        userId,
        isDisabled: true,
      });
      getCampaignStub.withArgs(campaign.code).resolves(campaign);
      organizationLearnerReceivedStub
        .withArgs({ userId, organizationId: organization.id })
        .resolves(disabledOrganizationLearner);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.findAssociationBetweenUserAndOrganizationLearner)({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerDisabledError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('The authenticated user is not the same as requested user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the repositories error', async function () {
      // given
      getCampaignStub.withArgs(campaign.code).resolves(campaign);
      organizationLearnerReceivedStub.withArgs({ userId, organizationId: organization.id }).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.findAssociationBetweenUserAndOrganizationLearner)({
        authenticatedUserId: '999',
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.be.instanceof(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('There is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // given
      getCampaignStub.withArgs(campaign.code).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.findAssociationBetweenUserAndOrganizationLearner)({
        authenticatedUserId: userId,
        requestedUserId: userId,
        campaignCode: campaign.code,
      });

      // then
      expect(result).to.be.instanceof(CampaignCodeError);
    });
  });
});
