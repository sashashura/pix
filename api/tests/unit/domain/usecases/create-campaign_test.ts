// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCamp... Remove this comment to see the full error message
const createCampaign = require('../../../../lib/domain/usecases/create-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCodeGenerator = require('../../../../lib/domain/services/campaigns/campaign-code-generator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCr... Remove this comment to see the full error message
const CampaignCreator = require('../../../../lib/domain/models/CampaignCreator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
const CampaignForCreation = require('../../../../lib/domain/models/CampaignForCreation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-campaign', function () {
  let campaignRepository: $TSFixMe;
  let campaignCreatorRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = { save: sinon.stub() };
    campaignCreatorRepository = { get: sinon.stub() };
    sinon.stub(campaignCodeGenerator, 'generate');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save the campaign', async function () {
    // given
    const code = 'ABCDEF123';
    const targetProfileId = 12;
    const creatorId = 13;
    const ownerId = 13;
    const organizationId = 14;
    const campaignData = {
      name: 'campagne utilisateur',
      type: CampaignTypes.ASSESSMENT,
      creatorId,
      ownerId,
      targetProfileId,
      organizationId,
    };
    const campaignForCreation = new CampaignForCreation({ ...campaignData, code });

    const campaignCreator = new CampaignCreator([targetProfileId]);
    campaignCreatorRepository.get.withArgs({ userId: creatorId, organizationId, ownerId }).resolves(campaignCreator);

    campaignCodeGenerator.generate.resolves(code);
    campaignRepository.save.resolves();

    // when
    await createCampaign({
      campaign: campaignData,
      campaignRepository,
      campaignCreatorRepository,
    });

    // then
    expect(campaignRepository.save).to.have.been.calledWith(campaignForCreation);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the newly created campaign', async function () {
    // given
    const code = 'ABCDEF123';
    const targetProfileId = 12;
    const creatorId = 13;
    const ownerId = 13;
    const organizationId = 14;
    const campaignData = {
      name: 'campagne utilisateur',
      type: CampaignTypes.ASSESSMENT,
      creatorId,
      ownerId,
      targetProfileId,
      organizationId,
    };
    const campaignCreator = new CampaignCreator([targetProfileId]);
    campaignCreatorRepository.get.withArgs({ userId: creatorId, organizationId, ownerId }).resolves(campaignCreator);

    campaignCodeGenerator.generate.resolves(code);
    const savedCampaign = Symbol('a saved campaign');

    campaignRepository.save.resolves(savedCampaign);

    // when
    const campaign = await createCampaign({
      campaign: campaignData,
      campaignRepository,
      campaignCreatorRepository,
    });

    // then
    expect(campaign).to.deep.equal(savedCampaign);
  });
});
