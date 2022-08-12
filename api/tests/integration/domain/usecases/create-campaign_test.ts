// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCr... Remove this comment to see the full error message
const campaignCreatorRepository = require('../../../../lib/infrastructure/repositories/campaign-creator-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCamp... Remove this comment to see the full error message
const createCampaign = require('../../../../lib/domain/usecases/create-campaign');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../../../lib/domain/models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-campaign', function () {
  let userId: $TSFixMe;
  let organizationId: $TSFixMe;
  let targetProfileId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;

    targetProfileId = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId }).id;

    databaseBuilder.factory.buildMembership({
      organizationId,
      userId,
    });

    await databaseBuilder.commit();

    const learningContent = {
      skills: [{ id: 'recSkill1' }],
    };

    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('campaigns').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save a new campaign of type ASSESSMENT', async function () {
    // given
    const campaign = {
      name: 'a name',
      type: CampaignTypes.ASSESSMENT,
      title: 'a title',
      idPixLabel: 'id Pix label',
      customLandingPageText: 'Hello',
      creatorId: userId,
      ownerId: userId,
      organizationId,
      targetProfileId,
    };

    const expectedAttributes = ['type', 'title', 'idPixLabel', 'name', 'customLandingPageText'];

    // when
    const result = await createCampaign({
      campaign,
      campaignRepository,
      campaignCreatorRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Campaign);

    expect(_.pick(result, expectedAttributes)).to.deep.equal(_.pick(campaign, expectedAttributes));

    expect('code').to.be.ok;
    expect('id').to.be.ok;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save a new campaign of type PROFILES_COLLECTION', async function () {
    // given
    const campaign = {
      name: 'a name',
      type: CampaignTypes.PROFILES_COLLECTION,
      idPixLabel: 'id Pix label',
      customLandingPageText: 'Hello',
      creatorId: userId,
      ownerId: userId,
      organizationId,
    };

    const expectedAttributes = ['type', 'idPixLabel', 'name', 'customLandingPageText'];

    // when
    const result = await createCampaign({
      campaign,
      campaignRepository,
      campaignCreatorRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(Campaign);

    expect(_.pick(result, expectedAttributes)).to.deep.equal(_.pick(campaign, expectedAttributes));

    expect('code').to.be.ok;
    expect('id').to.be.ok;
  });
});
