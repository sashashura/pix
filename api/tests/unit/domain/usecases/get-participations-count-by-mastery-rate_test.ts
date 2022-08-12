// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getParticipationsCountByMasteryRate = require('../../../../lib/domain/usecases/get-participations-count-by-mastery-rate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | getParticipationsCountByMasteryRate', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user has access to the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('return the distribution of results', async function () {
      const campaignId = 12;
      const userId = 12;
      const expectedResultDistribution = Symbol('ResultDitribution');
      const campaignParticipationsStatsRepository = { countParticipationsByMasteryRate: sinon.stub() };
      const campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.withArgs(campaignId, userId).resolves(true);
      campaignParticipationsStatsRepository.countParticipationsByMasteryRate
        .withArgs({ campaignId })
        .resolves(expectedResultDistribution);

      const participationsCountByMasteryRate = await getParticipationsCountByMasteryRate({
        campaignId,
        userId,
        campaignParticipationsStatsRepository,
        campaignRepository,
      });

      expect(participationsCountByMasteryRate).to.equal(expectedResultDistribution);
    });
  });
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user does not have access to the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error', async function () {
      const campaignId = 12;
      const userId = 12;
      const campaignParticipationsStatsRepository = { countParticipationsByMasteryRate: sinon.stub() };
      const campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.resolves(false);
      campaignParticipationsStatsRepository.countParticipationsByMasteryRate.rejects();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getParticipationsCountByMasteryRate)({
        campaignId,
        userId,
        campaignParticipationsStatsRepository,
        campaignRepository,
      });

      expect(error).to.be.an.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
