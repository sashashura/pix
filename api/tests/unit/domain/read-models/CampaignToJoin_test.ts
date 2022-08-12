// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignToJoin', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is of type ASSESSMENT', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.ASSESSMENT });

      // when / then
      expect(campaignToJoin.isAssessment).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not of type ASSESSMENT', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.PROFILES_COLLECTION });

      // when / then
      expect(campaignToJoin.isAssessment).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isProfilesCollection', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is of type PROFILES_COLLECTION', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.PROFILES_COLLECTION });

      // when / then
      expect(campaignToJoin.isProfilesCollection).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not of type PROFILES_COLLECTION', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.ASSESSMENT });

      // when / then
      expect(campaignToJoin.isProfilesCollection).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isArchived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is archived', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ archivedAt: new Date('2020-02-02') });

      // when / then
      expect(campaignToJoin.isArchived).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not archived', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ archivedAt: null });

      // when / then
      expect(campaignToJoin.isArchived).to.be.false;
    });
  });
});
