// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
const { getCampaignUrl } = require('../../../../lib/infrastructure/utils/url-builder');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | url-builder', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCampaignUrl', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if campaignCode is not defined', function () {
      expect(getCampaignUrl('fr', null)).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when campaignCode is defined', function () {
      const campaignCode = 'AZERTY123';

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return campaignUrl with fr domain when locale is fr-fr', function () {
        expect(getCampaignUrl('fr-fr', campaignCode)).to.be.equal(`https://app.pix.fr/campagnes/${campaignCode}`);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return campaignUrl with org domain when locale is fr', function () {
        expect(getCampaignUrl('fr', campaignCode)).to.be.equal(
          `https://app.pix.org/campagnes/${campaignCode}/?lang=fr`
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return campaignUrl with org domain when locale is en', function () {
        expect(getCampaignUrl('en', campaignCode)).to.be.equal(
          `https://app.pix.org/campagnes/${campaignCode}/?lang=en`
        );
      });
    });
  });
});
