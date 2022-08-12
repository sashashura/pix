// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationService = require('./../../../../lib/domain/services/campaign-participation-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Campaign Participation Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('progress', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign participation is completed ', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 1', function () {
        // when
        const progress = campaignParticipationService.progress(true, 10, 20);

        // then
        expect(progress).to.equal(1);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign participation is not completed', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return Percentage Progression', function () {
        // when
        const progress = campaignParticipationService.progress(false, 11, 33);

        // then
        expect(progress).to.equal(0.333);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return round percentage progression', function () {
        // when
        const progress = campaignParticipationService.progress(false, 6, 9);

        // then
        expect(progress).to.equal(0.667);
      });
    });
  });
});
