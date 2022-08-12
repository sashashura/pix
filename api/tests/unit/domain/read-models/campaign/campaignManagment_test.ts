// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
const CampaignManagement = require('../../../../../lib/domain/read-models/CampaignManagement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('campaignManagement', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#totalParticipationsCount', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns total participations count', function () {
      const campaignManagement = new CampaignManagement({
        id: 1,
        name: 'Assessment101',
        shared: 5,
        started: 3,
        completed: 2,
      });

      expect(campaignManagement.totalParticipationsCount).to.equal(10);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns total participations count when started is undifined', function () {
      const campaignManagement = new CampaignManagement({
        id: 1,
        name: 'Assessment101',
        shared: 5,
        started: undefined,
        completed: 2,
      });

      expect(campaignManagement.totalParticipationsCount).to.equal(7);
    });
  });
});
