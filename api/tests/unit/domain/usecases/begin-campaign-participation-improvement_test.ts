// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'beginCampa... Remove this comment to see the full error message
const { beginCampaignParticipationImprovement } = require('../../../../lib/domain/usecases');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadySha... Remove this comment to see the full error message
  AlreadySharedCampaignParticipationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToAccessEntityError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Usecase | begin-campaign-participation-improvement', function () {
  let dependencies: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;
  let assessmentRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignParticipationRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };
    assessmentRepository = {
      save: sinon.stub(),
    };
    dependencies = { campaignParticipationRepository, assessmentRepository };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error if the campaign participation is not linked to user', async function () {
    // given
    const userId = 1;
    const campaignParticipationId = 2;
    const campaignParticipation = domainBuilder.buildCampaignParticipation({
      userId: userId + 1,
      id: campaignParticipationId,
    });
    campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(beginCampaignParticipationImprovement)({
      campaignParticipationId,
      userId,
      ...dependencies,
    });

    // then
    expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error if the campaign participation is shared', async function () {
    // given
    const userId = 1;
    const campaignParticipationId = 2;
    const campaignParticipation = domainBuilder.buildCampaignParticipation({
      userId,
      id: campaignParticipationId,
      status: CampaignParticipationStatuses.SHARED,
    });
    campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(beginCampaignParticipationImprovement)({
      campaignParticipationId,
      userId,
      ...dependencies,
    });

    // then
    expect(error).to.be.instanceOf(AlreadySharedCampaignParticipationError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not start another assessment when the current assessment of the campaign is of improving type and still ongoing', async function () {
    // given
    const userId = 1;
    const campaignParticipationId = 2;
    const ongoingAssessment = domainBuilder.buildAssessment.ofTypeCampaign({
      userId,
      campaignParticipationId,
      isImproving: true,
      state: Assessment.states.STARTED,
    });
    const campaignParticipation = domainBuilder.buildCampaignParticipation({
      userId,
      id: campaignParticipationId,
      status: CampaignParticipationStatuses.STARTED,
      assessments: [ongoingAssessment],
    });
    campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);

    // when
    await beginCampaignParticipationImprovement({ campaignParticipationId, userId, ...dependencies });

    // then
    expect(assessmentRepository.save).to.not.have.been.called;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create a campaign assessment with the campaignParticipationId and isImproving at true', async function () {
    // given
    const userId = 1;
    const campaignParticipationId = 2;
    const latestAssessment = domainBuilder.buildAssessment.ofTypeCampaign({
      userId,
      campaignParticipationId,
      isImproving: true,
      state: Assessment.states.COMPLETED,
    });
    const campaignParticipation = domainBuilder.buildCampaignParticipation({
      userId,
      id: campaignParticipationId,
      status: CampaignParticipationStatuses.STARTED,
      assessments: [latestAssessment],
    });
    campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
    assessmentRepository.save.resolves({});

    // when
    await beginCampaignParticipationImprovement({ campaignParticipationId, userId, ...dependencies });

    // then
    expect(assessmentRepository.save).to.have.been.called;

    const assessmentToSave = assessmentRepository.save.firstCall.args[0].assessment;
    expect(assessmentToSave.type).to.equal(Assessment.types.CAMPAIGN);
    expect(assessmentToSave.state).to.equal(Assessment.states.STARTED);
    expect(assessmentToSave.userId).to.equal(userId);
    expect(assessmentToSave.courseId).to.equal('[NOT USED] Campaign Assessment CourseId Not Used');
    expect(assessmentToSave.campaignParticipationId).to.equal(campaignParticipationId);
    expect(assessmentToSave.isImproving).to.be.true;
  });
});
