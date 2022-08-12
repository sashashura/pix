// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getUserCampaignAssessmentResult = require('../../../../lib/domain/usecases/get-user-campaign-assessment-result');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, NoCampaignParticipationForUserAndCampaign } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-campaign-assessment-result', function () {
  let participantResultRepository: $TSFixMe, campaignParticipationRepository: $TSFixMe;
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    participantResultRepository = { getByUserIdAndCampaignId: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the participant result', async function () {
    const userId = domainBuilder.buildUser().id;
    const campaignId = domainBuilder.buildCampaign().id;
    const locale = 'FR';
    const results = Symbol();

    participantResultRepository.getByUserIdAndCampaignId.withArgs({ userId, campaignId, locale }).resolves(results);

    const actualCampaignParticipationResult = await getUserCampaignAssessmentResult({
      userId,
      campaignId,
      locale,
      campaignParticipationRepository,
      participantResultRepository,
    });

    expect(actualCampaignParticipationResult).to.deep.equal(results);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when there is no participation for given campaign and user', async function () {
    const userId = domainBuilder.buildUser().id;
    const campaignId = domainBuilder.buildCampaign().id;
    const locale = 'FR';

    participantResultRepository.getByUserIdAndCampaignId
      .withArgs({ userId, campaignId, locale })
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      .rejects(new NotFoundError());

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getUserCampaignAssessmentResult)({
      userId,
      campaignId,
      locale,
      campaignParticipationRepository,
      participantResultRepository,
    });

    expect(error).to.be.instanceOf(NoCampaignParticipationForUserAndCampaign);
  });
});
