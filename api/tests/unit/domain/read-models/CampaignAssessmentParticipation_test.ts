// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipation = require('../../../../lib/domain/read-models/CampaignAssessmentParticipation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignAssessmentParticipation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#progression', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when state is STARTED', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when testedSkillsCount = 0', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should compute a progression of 0', function () {
          const testedSkillsCount = 0;
          const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
            state: Assessment.states.STARTED,
            testedSkillsCount,
            targetedSkillsCount: 10,
          });

          expect(campaignAssessmentParticipation.progression).equal(0);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when testedSkillsCount != 0', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should compute a progression accordingly', function () {
          const targetedSkillsCount = 40;
          const testedSkillsCount = 10;
          const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
            state: Assessment.states.STARTED,
            testedSkillsCount,
            targetedSkillsCount,
          });

          expect(campaignAssessmentParticipation.progression).equal(0.25);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should compute a progression accordingly with rounded value', function () {
          const targetedSkillsCount = 30;
          const testedSkillsCount = 10;
          const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
            state: Assessment.states.STARTED,
            testedSkillsCount,
            targetedSkillsCount,
          });

          expect(campaignAssessmentParticipation.progression).equal(0.33);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when state is COMPLETED', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 100', function () {
        const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
          assessmentState: Assessment.states.COMPLETED,
        });

        expect(campaignAssessmentParticipation.progression).equal(1);
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
        const campaignAssessmentParticipation = new CampaignAssessmentParticipation({ masteryRate: null });

        // then
        expect(campaignAssessmentParticipation.masteryRate).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate is undefined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null for the masteryRate', function () {
        // when
        const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
          masteryRate: undefined,
        });

        // then
        expect(campaignAssessmentParticipation.masteryRate).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate equals to 0', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 0 for the masteryRate', function () {
        // when
        const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
          masteryRate: 0,
        });

        // then
        expect(campaignAssessmentParticipation.masteryRate).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the masteryRate is a string', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the number for the masteryRate', function () {
        // when
        const campaignAssessmentParticipation = new CampaignAssessmentParticipation({
          masteryRate: '0.75',
        });

        // then
        expect(campaignAssessmentParticipation.masteryRate).to.equal(0.75);
      });
    });
  });
});
