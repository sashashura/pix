// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignRe... Remove this comment to see the full error message
const CampaignReport = require('../../../../lib/domain/read-models/CampaignReport');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCampaign = require('../../../../lib/domain/usecases/get-campaign');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-campaign', function () {
  let userId: $TSFixMe, campaignId: $TSFixMe, campaign: $TSFixMe, stages: $TSFixMe, badges: $TSFixMe, masteryRates: $TSFixMe;
  let campaignRepository: $TSFixMe;
  let campaignReportRepository: $TSFixMe;
  let stageRepository: $TSFixMe;
  let badgeRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    badges = Symbol('badges');
    stages = Symbol('stages');
    masteryRates = Symbol('masteryRates');

    campaignId = 1;
    userId = 1;
    campaign = new CampaignReport({
      id: campaignId,
      name: 'My campaign',
      type: 'ASSESSMENT',
    });

    badgeRepository = {
      findByCampaignId: sinon.stub(),
    };
    campaignRepository = {
      checkIfUserOrganizationHasAccessToCampaign: sinon.stub(),
    };
    campaignReportRepository = {
      get: sinon.stub(),
      findMasteryRates: sinon.stub(),
    };
    stageRepository = {
      findByCampaignId: sinon.stub(),
    };

    badgeRepository.findByCampaignId.resolves(badges);
    campaignRepository.checkIfUserOrganizationHasAccessToCampaign.resolves(true);
    campaignReportRepository.get.resolves(campaign);
    campaignReportRepository.findMasteryRates.resolves(masteryRates);
    stageRepository.findByCampaignId.resolves(stages);
    sinon.stub(CampaignReport.prototype, 'computeAverageResult');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the campaign', async function () {
    // when
    const resultCampaign = await getCampaign({
      campaignId,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    expect(resultCampaign.name).to.equal(campaign.name);
    expect(campaignRepository.checkIfUserOrganizationHasAccessToCampaign).calledWith(campaignId, userId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get campaign stages', async function () {
    // when
    const resultCampaign = await getCampaign({
      campaignId,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    expect(resultCampaign.stages).to.equal(stages);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get campaign badges', async function () {
    // when
    const resultCampaign = await getCampaign({
      campaignId,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    expect(resultCampaign.badges).to.equal(badges);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should compute average results if campaign type is assessment', async function () {
    // when
    await getCampaign({
      campaignId,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    sinon.assert.calledWithExactly(CampaignReport.prototype.computeAverageResult, masteryRates);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not compute average results if campaign type is profiles collection', async function () {
    const profilesCollectionCampaign = new CampaignReport({
      id: 999,
      type: 'PROFILES_COLLECTION',
    });
    campaignReportRepository.get.resolves(profilesCollectionCampaign);

    // when
    await getCampaign({
      campaignId: profilesCollectionCampaign.id,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    sinon.assert.notCalled(CampaignReport.prototype.computeAverageResult);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a Not found error when the campaign is searched with a not valid ID', async function () {
    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getCampaign)({
      campaignId: 'invalid Campaign Id',
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    expect(error).to.be.instanceOf(NotFoundError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should throw UserNotAuthorizedToAccessEntityError when user does not belong to organization's campaign", async function () {
    // given
    campaignRepository.checkIfUserOrganizationHasAccessToCampaign.resolves(false);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getCampaign)({
      campaignId,
      userId,
      badgeRepository,
      campaignRepository,
      campaignReportRepository,
      stageRepository,
    });

    // then
    return expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
  });
});
