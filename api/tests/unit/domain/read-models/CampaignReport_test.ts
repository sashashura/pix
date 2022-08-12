// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignReport', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should define target profile informations', function () {
    const targetProfileForSpecifier = {
      name: 'target profile',
      description: 'description',
      TubesCount: 2,
      hasStage: false,
      thematicResult: 3,
    };

    const campaignReport = domainBuilder.buildCampaignReport({ targetProfileForSpecifier });

    expect(campaignReport.targetProfileName).to.equal(targetProfileForSpecifier.name);
    expect(campaignReport.targetProfileDescription).to.equal(targetProfileForSpecifier.description);
    // @ts-expect-error TS(2551): Property 'tubeCount' does not exist on type '{ nam... Remove this comment to see the full error message
    expect(campaignReport.targetProfileTubesCount).to.equal(targetProfileForSpecifier.tubeCount);
    expect(campaignReport.targetProfileThematicResult).to.equal((targetProfileForSpecifier as $TSFixMe).thematicResultCount);
    expect(campaignReport.targetProfileHasStage).to.equal(targetProfileForSpecifier.hasStage);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is of type ASSESSMENT', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ type: CampaignTypes.ASSESSMENT });

      // when / then
      expect(campaignReport.isAssessment).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not of type ASSESSMENT', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ type: CampaignTypes.PROFILES_COLLECTION });

      // when / then
      expect(campaignReport.isAssessment).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isProfilesCollection', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is of type PROFILES_COLLECTION', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ type: CampaignTypes.PROFILES_COLLECTION });

      // when / then
      expect(campaignReport.isProfilesCollection).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not of type PROFILES_COLLECTION', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ type: CampaignTypes.ASSESSMENT });

      // when / then
      expect(campaignReport.isProfilesCollection).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isArchived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is archived', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ archivedAt: new Date('2020-02-02') });

      // when / then
      expect(campaignReport.isArchived).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not archived', function () {
      // given
      const campaignReport = domainBuilder.buildCampaignReport({ archivedAt: null });

      // when / then
      expect(campaignReport.isArchived).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#computeAverageResult', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no masteryRates', function () {
      const campaignReport = domainBuilder.buildCampaignReport();

      campaignReport.computeAverageResult([]);

      expect(campaignReport.averageResult).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a not rounded result if there is masteryRates', function () {
      const campaignReport = domainBuilder.buildCampaignReport();

      campaignReport.computeAverageResult([0.13, 0.52]);

      expect(campaignReport.averageResult).to.equal(0.325);
    });
  });
});
