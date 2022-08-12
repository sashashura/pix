// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignToStartParticipation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is of type ASSESSMENT', function () {
      // given
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
        type: CampaignTypes.ASSESSMENT,
      });

      // when / then
      expect(campaignToStartParticipation.isAssessment).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not of type ASSESSMENT', function () {
      // given
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
        type: CampaignTypes.PROFILES_COLLECTION,
      });

      // when / then
      expect(campaignToStartParticipation.isAssessment).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isArchived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the campaign is archived', function () {
      // given
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
        archivedAt: new Date('2020-02-02'),
      });

      // when / then
      expect(campaignToStartParticipation.isArchived).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the campaign is not archived', function () {
      // given
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({ archivedAt: null });

      // when / then
      expect(campaignToStartParticipation.isArchived).to.be.false;
    });
  });
});
