// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAu... Remove this comment to see the full error message
const CampaignAuthorization = require('../../../../../lib/application/preHandlers/models/CampaignAuthorization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | models | CampaignAuthorization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAllowedToManage', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user is member of organization and not owner of the campaign', function () {
      // given
      const prescriberRole = 'MEMBER';

      // when
      const hasAccess = CampaignAuthorization.isAllowedToManage({ prescriberRole });

      //then
      expect(hasAccess).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user is admin of organization', function () {
      // given
      const prescriberRole = 'ADMIN';

      // when
      const hasAccess = CampaignAuthorization.isAllowedToManage({ prescriberRole });

      //then
      expect(hasAccess).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user is owner of the campaign', function () {
      // given
      const prescriberRole = 'OWNER';

      // when
      const hasAccess = CampaignAuthorization.isAllowedToManage({ prescriberRole });

      //then
      expect(hasAccess).to.be.true;
    });
  });
});
