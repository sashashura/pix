// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getProgression = require('../../../../lib/domain/usecases/get-progression');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-progression', function () {
  const assessmentId = 1234;
  const progressionId = `progression-${assessmentId}`;
  const userId = 9874;

  let campaignParticipationRepository: $TSFixMe;
  let targetProfileRepository: $TSFixMe;
  let knowledgeElementRepository: $TSFixMe;
  let assessmentRepository: $TSFixMe;
  let competenceEvaluationRepository: $TSFixMe;
  let skillRepository: $TSFixMe;
  let improvementService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignParticipationRepository = { get: sinon.stub(), isRetrying: sinon.stub() };
    targetProfileRepository = { getByCampaignId: sinon.stub() };
    knowledgeElementRepository = { findUniqByUserId: sinon.stub().resolves([]) };
    assessmentRepository = { getByAssessmentIdAndUserId: sinon.stub() };
    competenceEvaluationRepository = { getByAssessmentId: sinon.stub() };
    skillRepository = { findActiveByCompetenceId: sinon.stub() };
    improvementService = { filterKnowledgeElementsIfImproving: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getProgression', function () {
    let assessment: $TSFixMe, campaignParticipation: $TSFixMe, targetProfile: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment exists and is campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        assessment = domainBuilder.buildAssessment({
          id: assessmentId,
          userId,
          state: 'completed',
          type: Assessment.types.CAMPAIGN,
          campaignParticipationId: 456,
        });
        targetProfile = domainBuilder.buildTargetProfile({});
        const campaign = domainBuilder.buildCampaign({ id: 123, targetProfile });
        campaignParticipation = domainBuilder.buildCampaignParticipation({
          id: assessment.campaignParticipationId,
          campaign,
        });

        assessmentRepository.getByAssessmentIdAndUserId.withArgs(assessment.id, userId).resolves(assessment);
        campaignParticipationRepository.get
          .withArgs(assessment.campaignParticipationId)
          .resolves(campaignParticipation);
        targetProfileRepository.getByCampaignId.withArgs(campaignParticipation.campaignId).resolves(targetProfile);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the progression associated to the assessment', async function () {
        // given
        const expectedProgression = domainBuilder.buildProgression({
          id: progressionId,
          targetedSkills: targetProfile.skills,
          knowledgeElements: [],
          isProfileCompleted: assessment.isCompleted(),
        });

        // when
        const progression = await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(progression).to.deep.equal(expectedProgression);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the assessment is improving', function () {
        let knowledgeElements: $TSFixMe, knowledgeElementsFiltered: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          assessment.state = 'improving';
          knowledgeElements = [domainBuilder.buildKnowledgeElement(), domainBuilder.buildKnowledgeElement()];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);
          campaignParticipationRepository.isRetrying
            .withArgs({ campaignParticipationId: assessment.campaignParticipationId })
            .resolves(false);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should filter the knowledge elements', async function () {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving).to.have.been.calledWith({
            knowledgeElements,
            assessment,
            isRetrying: false,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the progression associated to the assessment', async function () {
          // given
          improvementService.filterKnowledgeElementsIfImproving
            .withArgs({ knowledgeElements, assessment, isRetrying: false })
            .returns(knowledgeElementsFiltered);
          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: targetProfile.skills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: assessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the assessment is improving because user is retrying campaign participation', function () {
        let knowledgeElements: $TSFixMe, knowledgeElementsFiltered: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          assessment.state = 'improving';
          knowledgeElements = [domainBuilder.buildKnowledgeElement(), domainBuilder.buildKnowledgeElement()];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);
          campaignParticipationRepository.isRetrying
            .withArgs({ campaignParticipationId: assessment.campaignParticipationId })
            .resolves(true);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should filter the knowledge elements', async function () {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving).to.have.been.calledWith({
            knowledgeElements,
            assessment,
            isRetrying: true,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the progression associated to the assessment', async function () {
          // given
          improvementService.filterKnowledgeElementsIfImproving
            .withArgs({ knowledgeElements, assessment, isRetrying: true })
            .returns(knowledgeElementsFiltered);

          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: targetProfile.skills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: assessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("campaign's method is flash", function () {
        let flashAssessment: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          flashAssessment = domainBuilder.buildAssessment.ofTypeCampaign({
            userId,
            targetProfile: null,
            method: 'FLASH',
            campaignParticipationId: campaignParticipation.id,
          });

          assessmentRepository.getByAssessmentIdAndUserId
            .withArgs(flashAssessment.id, userId)
            .resolves(flashAssessment);
          campaignParticipationRepository.get
            .withArgs(flashAssessment.campaignParticipationId)
            .resolves(campaignParticipation);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the progression associated to the flash assessment', async function () {
          // given
          const flashProgressionId = `progression-${flashAssessment.id}`;
          const expectedProgression = domainBuilder.buildProgression({
            id: flashProgressionId,
            targetedSkills: [],
            knowledgeElements: [],
            isProfileCompleted: assessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId: flashProgressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment exists and is competence evaluation', function () {
      let competenceEvaluationAssessment: $TSFixMe, competenceEvaluation, competenceSkills: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        competenceEvaluationAssessment = domainBuilder.buildAssessment({
          id: assessmentId,
          userId,
          type: Assessment.types.COMPETENCE_EVALUATION,
        });
        competenceEvaluation = domainBuilder.buildCompetenceEvaluation({
          competenceId: 1,
          assessmentId,
          userId,
        });
        competenceSkills = [domainBuilder.buildSkill()];

        assessmentRepository.getByAssessmentIdAndUserId.resolves(competenceEvaluationAssessment);
        competenceEvaluationRepository.getByAssessmentId.resolves(competenceEvaluation);
        skillRepository.findActiveByCompetenceId.resolves(competenceSkills);
        improvementService.filterKnowledgeElementsIfImproving
          .withArgs({ knowledgeElements: [], assessment: competenceEvaluationAssessment })
          .returns([]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should load the right assessment', async function () {
        // when
        await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(competenceEvaluationRepository.getByAssessmentId).to.have.been.calledWith(assessmentId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the progression associated to the assessment', async function () {
        // given
        const expectedProgression = domainBuilder.buildProgression({
          id: progressionId,
          targetedSkills: competenceSkills,
          knowledgeElements: [],
          isProfileCompleted: competenceEvaluationAssessment.isCompleted(),
        });

        // when
        const progression = await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(progression).to.deep.equal(expectedProgression);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the assessment is improving', function () {
        let knowledgeElements: $TSFixMe, knowledgeElementsFiltered: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          competenceEvaluationAssessment.state = 'improving';
          knowledgeElements = [domainBuilder.buildKnowledgeElement(), domainBuilder.buildKnowledgeElement()];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);

          improvementService.filterKnowledgeElementsIfImproving
            .withArgs({ knowledgeElements, assessment: competenceEvaluationAssessment })
            .returns(knowledgeElementsFiltered);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should filter the knowledge elements', async function () {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving).to.have.been.calledWith({
            knowledgeElements,
            assessment: competenceEvaluationAssessment,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the progression associated to the assessment', async function () {
          // given
          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: competenceSkills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: competenceEvaluationAssessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should transfer the errors', async function () {
        // given
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        assessmentRepository.getByAssessmentIdAndUserId.rejects(new NotFoundError('No found Assessment for ID 1234'));

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(getProgression)({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        return expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
