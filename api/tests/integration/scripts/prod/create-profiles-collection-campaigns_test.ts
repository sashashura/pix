// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareCam... Remove this comment to see the full error message
const { prepareCampaigns, checkData } = require('../../../../scripts/prod/create-profiles-collection-campaigns');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | create-profile-collection-campaigns', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#prepareCampaigns', function () {
    let organizationId1: $TSFixMe;
    let organizationId2: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId1 = databaseBuilder.factory.buildOrganization().id;
      organizationId2 = databaseBuilder.factory.buildOrganization().id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should generate a code for the campaign model', async function () {
      // given
      const campaignData = {
        customLandingPageText: 'customLandingPageText',
        name: 'CampaignName',
        organizationId: organizationId1,
        creatorId: '789',
        multipleSendings: false,
      };

      // when
      const campaigns = await prepareCampaigns([campaignData]);

      // then
      expect(typeof campaigns[0].code === 'string').to.be.true;
      expect(campaigns[0].code.length).to.equal(9);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be a profile collection type for the campaign model', async function () {
      // given
      const campaignData = {
        customLandingPageText: 'customLandingPageText',
        name: 'CampaignName',
        organizationId: organizationId1,
        creatorId: '789',
        multipleSendings: false,
      };

      // when
      const campaigns = await prepareCampaigns([campaignData]);

      // then
      expect(campaigns[0].type).to.equal(CampaignTypes.PROFILES_COLLECTION);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create campaigns for each organizationId', async function () {
      // given
      const creatorId = '789';

      const campaignData1 = {
        name: 'Name1',
        organizationId: organizationId1,
        customLandingPageText: 'customLandingPageText1',
        creatorId,
        multipleSendings: false,
      };
      const campaignData2 = {
        name: 'Name2',
        organizationId: organizationId2,
        customLandingPageText: undefined,
        creatorId,
        multipleSendings: false,
      };

      // when
      const campaigns = await prepareCampaigns([campaignData1, campaignData2]);

      // then
      expect(campaigns).to.have.length(2);
      expect(campaigns[0].organizationId).to.equal(organizationId1);
      expect(campaigns[0].name).to.equal(campaignData1.name);
      expect(campaigns[0].customLandingPageText).to.equal(campaignData1.customLandingPageText);
      expect(campaigns[0].creatorId).to.equal(creatorId);

      expect(campaigns[1].organizationId).to.equal(organizationId2);
      expect(campaigns[1].name).to.equal(campaignData2.name);
      expect(campaigns[1].customLandingPageText).to.equal(undefined);
      expect(campaigns[1].creatorId).to.equal(creatorId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a validate error when campaign is not valid', async function () {
      // given
      const creatorId = '789';
      const campaignData = {
        name: '',
        organizationId: organizationId1,
        multipleSendings: false,
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(prepareCampaigns)([campaignData], creatorId);

      // then
      expect(error).to.be.instanceOf(EntityValidationError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkData', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create proper campaign attributes', function () {
      // given
      const name = 'SomeName';
      const organizationId = 3;
      const customLandingPageText = 'SomeLandingPageText';
      const creatorId = 123;
      const csvData = [{ name, organizationId, customLandingPageText, creatorId }];

      // when
      const checkedData = checkData(csvData);

      // then
      expect(checkedData[0]).to.deep.equal({
        organizationId,
        name,
        customLandingPageText,
        creatorId,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create proper campaign attributes even customLandingPageText is missing', async function () {
      // given
      const name = 'SomeName';
      const customLandingPageText = undefined;
      const organizationId = '123';
      const creatorId = '789';
      const csvData = [{ name, organizationId, customLandingPageText, creatorId }];

      // when
      const checkedData = checkData(csvData);

      // then
      expect(checkedData[0]).to.deep.equal({
        organizationId,
        name,
        customLandingPageText,
        creatorId,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if campaign organizationId is missing', async function () {
      // given
      const name = 'SomeName';
      const organizationId = '';
      const creatorId = '123';
      const csvData = [{ name, organizationId, creatorId }];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkData)(csvData);

      // then
      expect(error).to.be.instanceOf(Error);
      expect((error as $TSFixMe).message).to.equal("Ligne 1: L'organizationId est obligatoire pour la campagne de collecte de profils.");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if campaign creatorId is missing', async function () {
      // given
      const name = 'SomeName';
      const organizationId = '123';
      const creatorId = '';
      const csvData = [{ name, organizationId, creatorId }];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkData)(csvData);

      // then
      expect(error).to.be.instanceOf(Error);
      expect((error as $TSFixMe).message).to.equal('Ligne 1: Le creatorId est obligatoire pour la campagne de collecte de profils.');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if campaign name is missing', async function () {
      // given
      const name = undefined;
      const organizationId = '123';
      const creatorId = '789';
      const csvData = [{ name, organizationId, creatorId }];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkData)(csvData);

      // then
      expect(error).to.be.instanceOf(Error);
      expect((error as $TSFixMe).message).to.equal('Ligne 1: Le nom de campagne est obligatoire pour la campagne de collecte de profils.');
    });
  });
});
