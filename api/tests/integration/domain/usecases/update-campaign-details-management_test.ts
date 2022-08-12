// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, knex, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignMa... Remove this comment to see the full error message
const campaignManagementRepository = require('../../../../lib/infrastructure/repositories/campaign-management-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateCamp... Remove this comment to see the full error message
const updateCampaignDetailsManagement = require('../../../../lib/domain/usecases/update-campaign-details-management');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | update-campaign-details-management', function () {
  let userId;
  let organizationId;
  let targetProfileId;
  let campaign: $TSFixMe, campaignId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;
    targetProfileId = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId }).id;
    databaseBuilder.factory.buildMembership({ organizationId, userId });
    campaign = databaseBuilder.factory.buildCampaign({
      targetProfileId,
      creatorId: userId,
      organizationId,
      multipleSendings: false,
    });
    campaignId = campaign.id;
    await databaseBuilder.commit();

    const learningContent = {
      skills: [{ id: 'recSkill1' }],
    };

    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update campaign', async function () {
    const campaignAttributes = {
      name: 'new Name',
      title: 'new title',
      customLandingPageText: 'new landing text',
      customResultPageText: 'new result text',
      customResultPageButtonText: 'new result button text',
      customResultPageButtonUrl: 'http://some.url.com',
      multipleSendings: true,
    };
    const expectedCampaign = { ...campaign, ...campaignAttributes };

    await updateCampaignDetailsManagement({ campaignId, ...campaignAttributes, campaignManagementRepository });

    const actualCampaign = await knex.select('*').from('campaigns').first();
    expect(actualCampaign).to.deep.equal(expectedCampaign);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not update multipleSendings attribute when campaign has participations', async function () {
    //given
    const campaignId = databaseBuilder.factory.buildCampaign({
      multipleSendings: false,
    }).id;

    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      status: SHARED,
    });

    await databaseBuilder.commit();

    //when
    const campaignAttributes = {
      name: 'new Name',
      title: 'new title',
      customLandingPageText: 'new landing text',
      customResultPageText: 'new result text',
      customResultPageButtonText: 'new result button text',
      customResultPageButtonUrl: 'http://some.url.com',
      multipleSendings: true,
    };

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(updateCampaignDetailsManagement)({
      campaignId,
      ...campaignAttributes,
      campaignManagementRepository,
    });

    //then
    const { multipleSendings: actualMultipleSendings } = await knex
      .select('multipleSendings')
      .from('campaigns')
      .where({ id: campaignId })
      .first();

    expect(error).to.be.an.instanceOf(EntityValidationError);
    expect(actualMultipleSendings).to.be.false;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update other attribut when campaign has participations', async function () {
    //given
    const campaignId = databaseBuilder.factory.buildCampaign({
      name: 'mapetitelicorne',
      multipleSendings: false,
    }).id;

    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      status: SHARED,
    });

    await databaseBuilder.commit();

    //when
    const campaignAttributes = {
      name: 'Daddy cool',
      title: 'new title',
      customLandingPageText: 'new landing text',
      customResultPageText: 'new result text',
      customResultPageButtonText: 'new result button text',
      customResultPageButtonUrl: 'http://some.url.com',
      multipleSendings: false,
    };

    await updateCampaignDetailsManagement({ campaignId, ...campaignAttributes, campaignManagementRepository });

    //then
    const { name: actualName } = await knex.select('name').from('campaigns').where({ id: campaignId }).first();

    expect(actualName).to.equal('Daddy cool');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update multipleSendings attribute when campaign has no participations', async function () {
    //given
    const campaignAttributes = {
      name: 'new Name',
      title: 'new title',
      customLandingPageText: 'new landing text',
      customResultPageText: 'new result text',
      customResultPageButtonText: 'new result button text',
      customResultPageButtonUrl: 'http://some.url.com',
      multipleSendings: true,
    };
    const expectedCampaign = { ...campaign, ...campaignAttributes };

    //when
    await updateCampaignDetailsManagement({ campaignId, ...campaignAttributes, campaignManagementRepository });

    //then
    const { multipleSendings: actualMultipleSendings } = await knex
      .select('multipleSendings')
      .from('campaigns')
      .first();
    expect(actualMultipleSendings).to.equal(expectedCampaign.multipleSendings);
  });
});
