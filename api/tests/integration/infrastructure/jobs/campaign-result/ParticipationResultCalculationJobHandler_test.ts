// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResultsShared = require('../../../../../lib/domain/events/CampaignParticipationResultsShared');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationResultCalculationJobHandler = require('../../../../../lib/infrastructure/jobs/campaign-result/ParticipationResultCalculationJobHandler');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Jobs | CampaignResult | ParticipationResultCalculation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('compute results', async function () {
      // given
      const event = new CampaignParticipationResultsShared({ campaignParticipationId: 1 });
      const participationResultsShared = Symbol('participation results shared');
      const participantResultsSharedRepository = { get: sinon.stub() };
      const campaignParticipationRepository = { update: sinon.stub() };
      const handler = new ParticipationResultCalculationJobHandler({
        participantResultsSharedRepository,
        campaignParticipationRepository,
      });
      participantResultsSharedRepository.get.withArgs(1).resolves(participationResultsShared);

      // when
      await handler.handle(event);

      // then
      expect(campaignParticipationRepository.update).to.have.been.calledWith(participationResultsShared);
    });
  });
});
