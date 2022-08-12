// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCurrentUser = require('../../../../lib/domain/usecases/get-current-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-current-user', function () {
  let userRepository: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = { get: sinon.stub() };
    campaignParticipationRepository = {
      hasAssessmentParticipations: sinon.stub(),
      getCodeOfLastParticipationToProfilesCollectionCampaignForUser: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the current user', async function () {
    // given
    userRepository.get.withArgs(1).resolves({ id: 1 });
    campaignParticipationRepository.hasAssessmentParticipations.withArgs(1).resolves(false);
    campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser
      .withArgs(1)
      .resolves('SOMECODE');

    // when
    const result = await getCurrentUser({
      authenticatedUserId: 1,
      userRepository,
      campaignParticipationRepository,
    });

    // then
    expect(result).to.deep.equal({ id: 1, hasAssessmentParticipations: false, codeForLastProfileToShare: 'SOMECODE' });
  });
});
