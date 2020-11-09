const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
const Assessment = require('../../../../lib/domain/models/Assessment');
const { NotFoundError, AssessmentNotCompletedError, AlreadySharedCampaignParticipationError } = require('../../../../lib/domain/errors');
const { expect, domainBuilder, catchErr } = require('../../../test-helper');

describe('Unit | Domain | Models | CampaignParticipation', () => {

  describe('#getTargetProfileId', () => {

    it('should return the targetProfileId from campaign associated', () => {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();
      const campaignParticipation = new CampaignParticipation({
        id: 1,
        campaign,
        assessmentId: 1,
      });

      // when
      const targetProfileId = campaignParticipation.getTargetProfileId();

      // then
      expect(targetProfileId).to.equal(campaign.targetProfileId);
    });

    it('should return null if has not campaign', () => {
      // given
      const campaignParticipation = new CampaignParticipation({
        id: 1,
        campaign: null,
        assessmentId: 1,
      });

      // when
      const targetProfileId = campaignParticipation.getTargetProfileId();

      // then
      expect(targetProfileId).to.equal(null);
    });

  });

  describe('#lastAssessment', () => {

    it('should retrieve the last assessment by creation date', () => {
      const campaignParticipation = new CampaignParticipation({
        assessments: [
          { createdAt: new Date('2010-10-02') },
          { createdAt: new Date('2010-10-06') },
          { createdAt: new Date('2010-10-04') },
        ],
      });
      expect(campaignParticipation.lastAssessment)
        .to.deep.equal({ createdAt: new Date('2010-10-06') });
    });

  });

  describe('#createImprovementAssessment', () => {
    context('when there is no assessments', () => {
      it('throws an error', async () => {
        const campaignParticipation = new CampaignParticipation({
          assessments: [],
        });
        const error = await catchErr(campaignParticipation.createImprovementAssessment, campaignParticipation)();

        expect(error).to.be.an.instanceOf(NotFoundError);
        expect(error.message).to.contains('Le participant n\'a pas été évalué sur cette campagne');
      });
    });

    context('when there are assessments', () => {
      context('when the last assessment is completed', () => {
        it('create an assessment with the state improvement', async () => {
          const campaignParticipation = new CampaignParticipation({
            id: 12,
            userId: 24,
            assessments: [
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-06'), state: Assessment.states.COMPLETED }),
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-02'), state: Assessment.states.STARTED }),
            ],
          });
          const assessment = campaignParticipation.createImprovementAssessment();

          expect(assessment).to.include({
            userId: campaignParticipation.userId,
            campaignParticipationId: campaignParticipation.id,
            state: Assessment.states.STARTED,
            type: Assessment.types.CAMPAIGN,
            courseId: Assessment.courseIdMessage.CAMPAIGN,
            isImproving: true,
          });
        });
      });

      context('when the last assessment is ongoing', () => {
        it('throws an error', async () => {
          const campaignParticipation = new CampaignParticipation({
            assessments: [
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-06'), state: Assessment.states.STARTED }),
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-02'), state: Assessment.states.COMPLETED }),
            ],
          });
          const error = await catchErr(campaignParticipation.createImprovementAssessment, campaignParticipation)();

          expect(error).to.be.an.instanceOf(AssessmentNotCompletedError);
          expect(error.message).to.contains('Le participant a une évaluation en cours pour cette campagne');
        });
      });

      context('when the last assessment is started', () => {
        it('throws an error', async () => {
          const campaignParticipation = new CampaignParticipation({
            assessments: [
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-06'), state: Assessment.states.STARTED }),
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-02'), state: Assessment.states.COMPLETED }),
            ],
          });
          const error = await catchErr(campaignParticipation.createImprovementAssessment, campaignParticipation)();

          expect(error).to.be.an.instanceOf(AssessmentNotCompletedError);
          expect(error.message).to.contains('Le participant a une évaluation en cours pour cette campagne');
        });
      });

      context('when the participant has shared his results', () => {
        it('throws an error', async () => {
          const campaignParticipation = new CampaignParticipation({
            isShared: true,
            assessments: [
              domainBuilder.buildAssessment({ createdAt: new Date('2010-10-02'), state: Assessment.states.COMPLETED }),
            ],
          });
          const error = await catchErr(campaignParticipation.createImprovementAssessment, campaignParticipation)();

          expect(error).to.be.an.instanceOf(AlreadySharedCampaignParticipationError);
          expect(error.message).to.contains('Le participant a déjà partagé ses résultats');
        });
      });
    });
  });
});
