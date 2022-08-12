// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResultMinimal = require('../../../../../lib/domain/read-models/campaign-results/CampaignAssessmentParticipationResultMinimal');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | CampaignResults | CampaignAssessmentParticipationResultMinimal', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly initialize the information about campaign participation result', function () {
      const campaignAssessmentParticipationResultMinimal = new CampaignAssessmentParticipationResultMinimal({
        campaignParticipationId: 45,
        firstName: 'Lidia',
        lastName: 'Aguilar',
        masteryRate: 0.45,
        participantExternalId: 'Alba67',
      });

      expect(campaignAssessmentParticipationResultMinimal).to.deep.equal({
        campaignParticipationId: 45,
        firstName: 'Lidia',
        lastName: 'Aguilar',
        badges: [],
        masteryRate: 0.45,
        participantExternalId: 'Alba67',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('masteryRate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate is null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null for the masteryRate', function () {
        // when
        const campaignAssessmentParticipationResultMinimal = new CampaignAssessmentParticipationResultMinimal({
          masteryRate: null,
        });

        // then
        expect(campaignAssessmentParticipationResultMinimal.masteryRate).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate is undefined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null for the masteryRate', function () {
        // when
        const campaignAssessmentParticipationResultMinimal = new CampaignAssessmentParticipationResultMinimal({
          masteryRate: undefined,
        });

        // then
        expect(campaignAssessmentParticipationResultMinimal.masteryRate).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate equals to 0', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 0 for the masteryRate', function () {
        // when
        const campaignAssessmentParticipationResultMinimal = new CampaignAssessmentParticipationResultMinimal({
          masteryRate: 0,
        });

        // then
        expect(campaignAssessmentParticipationResultMinimal.masteryRate).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate is a string', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the number for the masteryRate', function () {
        // when
        const campaignAssessmentParticipationResultMinimal = new CampaignAssessmentParticipationResultMinimal({
          masteryRate: '0.75',
        });

        // then
        expect(campaignAssessmentParticipationResultMinimal.masteryRate).to.equal(0.75);
      });
    });
  });
});
