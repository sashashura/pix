const { expect, databaseBuilder, knex } = require('../../../test-helper');
const Assessment = require('../../../../lib/domain/models/Assessment');
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
const beginCampaignParticipationImprovement = require('../../../../lib/domain/usecases/begin-campaign-participation-improvement');

describe.only('Integration | Usecase | begin-campaign-participation-improvement', () => {
  const dependencies = { campaignParticipationRepository,  assessmentRepository };

  it('should create a campaign assessment with the campaignParticipationId and isImproving at true', async () => {
    const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ isShared:  false });
    databaseBuilder.factory.buildAssessment({
      userId: campaignParticipation.userId,
      campaignParticipationId: campaignParticipation.id,
    });

    await databaseBuilder.commit();

    await beginCampaignParticipationImprovement({
      campaignParticipationId: campaignParticipation.id,
      userId: campaignParticipation.userId,
      ...dependencies,
    });

    const [assessment] = await knex('assessments').select('*').orderBy('createdAt', 'DESC');
    expect(assessment).include({
      userId: campaignParticipation.userId,
      campaignParticipationId: campaignParticipation.id,
      state: Assessment.states.STARTED,
      type: Assessment.types.CAMPAIGN,
      courseId: Assessment.courseIdMessage.CAMPAIGN,
      isImproving: true,
    });
  });
});
