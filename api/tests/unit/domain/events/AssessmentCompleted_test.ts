// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | AssessmentCompleted', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isCertificationType', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when assessment is of type certification', function () {
      // given
      const assessmentCompleted = new AssessmentCompleted({
        certificationCourseId: 123,
      });

      // when / then
      expect(assessmentCompleted.isCertificationType).to.be.true;
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when assessment is not of type certification', function () {
      // given
      const assessmentCompleted = new AssessmentCompleted({
        certificationCourseId: null,
      });

      // when / then
      expect(assessmentCompleted.isCertificationType).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isCampaignType', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when assessment is of type campaign', function () {
      // given
      const assessmentCompleted = new AssessmentCompleted({
        campaignParticipationId: 123,
      });

      // when / then
      expect(assessmentCompleted.isCampaignType).to.be.true;
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when assessment is not of type campaign', function () {
      // given
      const assessmentCompleted = new AssessmentCompleted({
        campaignParticipationId: null,
      });

      // when / then
      expect(assessmentCompleted.isCampaignType).to.be.false;
    });
  });
});
