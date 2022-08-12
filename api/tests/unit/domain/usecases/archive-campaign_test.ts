// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const archiveCampaign = require('../../../../lib/domain/usecases/archive-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateCampaignError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | archive-campaign', function () {
  const userId = 'user id';
  const campaignId = 'campaign id';
  let campaignRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = {
      update: sinon.stub(),
      checkIfUserOrganizationHasAccessToCampaign: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user has the rights to update the campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
      return archiveCampaign({ campaignId, userId, campaignRepository });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should verify that the user has the rights', async function () {
      expect(campaignRepository.checkIfUserOrganizationHasAccessToCampaign).to.have.been.calledWithExactly(
        campaignId,
        userId
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign', function () {
      expect(campaignRepository.update).to.have.been.calledWithExactly({
        id: campaignId,
        archivedAt: sinon.match.instanceOf(Date),
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user has no rights to update the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToUpdateCampaignError', async function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.rejects(
        new UserNotAuthorizedToUpdateCampaignError()
      );

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(archiveCampaign)({ campaignId, userId, campaignRepository });

      expect(error).to.be.instanceOf(UserNotAuthorizedToUpdateCampaignError);
    });
  });
});
