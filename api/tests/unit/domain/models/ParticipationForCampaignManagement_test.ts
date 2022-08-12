// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationForCampaignManagement = require('../../../../lib/domain/models/ParticipationForCampaignManagement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ParticipationForCampaignManagement', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#userFullName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('computes the user fullname', function () {
      // when
      const participationForCampaignManagement = new ParticipationForCampaignManagement({
        userFirstName: 'Jacques',
        userLastName: 'Ouche',
      });

      // then
      expect(participationForCampaignManagement.userFullName).to.equal('Jacques Ouche');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#deletedByFullName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('computes the deleted fullname', function () {
      // when
      const participationForCampaignManagement = new ParticipationForCampaignManagement({
        deletedAt: new Date(),
        deletedByFirstName: 'Jim',
        deletedByLastName: 'Nastik',
      });

      // then
      expect(participationForCampaignManagement.deletedByFullName).to.equal('Jim Nastik');
    });
  });
});
